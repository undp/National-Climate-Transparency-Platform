import { Index, ViewColumn, ViewEntity } from "typeorm"

export const actionViewSQL = `
WITH fullp AS (
	SELECT 
			prg."programmeId",
			prg."actionId",
			prg."natImplementor" AS nat_impl,
			COALESCE(SUM(pve."achievedGHGReduction"), 0) AS "achievedGHGReduction",
			COALESCE(SUM(pve."expectedGHGReduction"), 0) AS "expectedGHGReduction",
			CUSTOM_ARRAY_AGG(pve."ghgsAffected") FILTER (WHERE pve."ghgsAffected" IS NOT NULL) AS "ghgsAffected"
	FROM 
			programme prg
	LEFT JOIN (
			SELECT 
					id,
					SUM("achievedGHGReduction") AS "achievedGHGReduction",
					SUM("expectedGHGReduction") AS "expectedGHGReduction",
					CUSTOM_ARRAY_AGG("ghgsAffected") FILTER (WHERE "ghgsAffected" IS NOT NULL) AS "ghgsAffected"
			FROM 
					programme_view_entity
			GROUP BY 
					id
	) pve ON prg."programmeId" = pve.id
	GROUP BY 
			prg."programmeId", prg."actionId", prg."natImplementor"
),
act AS (
	SELECT 
			a."parentId" AS "actionId",
			ARRAY_AGG(DISTINCT a."nationalImplementingEntity") FILTER (WHERE a."nationalImplementingEntity" IS NOT NULL) AS nat_impl,
			COALESCE(SUM(a."achievedGHGReduction"), 0) AS "achievedGHGReduction",
			COALESCE(SUM(a."expectedGHGReduction"), 0) AS "expectedGHGReduction",
			ARRAY_AGG(a."ghgsAffected") FILTER (WHERE a."ghgsAffected" IS NOT NULL)::character varying[] AS "ghgsAffected"
	FROM 
			activity a
	WHERE 
			a."parentType" = 'action'
	GROUP BY 
			a."parentId"
),
finance AS (
	SELECT 
			action,
			SUM("totalRequired") AS "totalRequired",
			SUM("totalReceived") AS "totalReceived"
	FROM 
			activity_view_entity
	GROUP BY 
			action
)
SELECT 
	a."actionId" AS id,
	CUSTOM_ARRAY_AGG(DISTINCT fullp.nat_impl) FILTER (WHERE fullp.nat_impl IS NOT NULL) || CUSTOM_ARRAY_AGG(DISTINCT act.nat_impl) FILTER (WHERE act.nat_impl IS NOT NULL) AS "natImplementors",
	COALESCE(SUM(fullp."achievedGHGReduction"), 0) + COALESCE(act."achievedGHGReduction", 0) AS "achievedGHGReduction",
	COALESCE(SUM(fullp."expectedGHGReduction"), 0) + COALESCE(act."expectedGHGReduction", 0) AS "expectedGHGReduction",
	MAX(finance."totalRequired") AS "financeNeeded",
	MAX(finance."totalReceived") AS "financeReceived",
	CUSTOM_ARRAY_AGG(DISTINCT COALESCE(fullp."ghgsAffected", '{}') || COALESCE(act."ghgsAffected", '{}')) FILTER (WHERE (fullp."ghgsAffected" IS NOT NULL OR act."ghgsAffected" IS NOT NULL)) AS "ghgsAffected"
FROM 
	action a
LEFT JOIN fullp ON a."actionId" = fullp."actionId"
LEFT JOIN act ON a."actionId" = act."actionId"
LEFT JOIN finance ON a."actionId" = finance.action
GROUP BY 
	a."actionId", act."achievedGHGReduction", act."expectedGHGReduction";`

@ViewEntity({
	name: 'action_view_entity',
	materialized: true,
	expression: actionViewSQL,
	synchronize: false
})
@Index("idx_action_view_entity_id")
export class ActionViewEntity {
	@ViewColumn()
	id: string

	@ViewColumn()
	natImplementors: string[];

	// @ViewColumn()
	// totalInvestment: number

	// From Project Entities

	@ViewColumn()
	achievedGHGReduction: number

	@ViewColumn()
	expectedGHGReduction: number

	// From Activity + Support View

	@ViewColumn()
	financeNeeded: number

	@ViewColumn()
	financeReceived: number

	@ViewColumn()
	ghgsAffected: string[]
}