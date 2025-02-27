import { Index, ViewColumn, ViewEntity } from "typeorm"

// ML: change how we get startYear, endYear and timeframe - we now getting it from activity (table t) instead from parent modules
const expandedActivity = `
Select 
	t."activityId",
	t."title",
	t."description",
	t."meansOfImplementation",
	t."anchoredInNationalStrategy",
	t."etfDescription",
	t."internationalImplementingEntity",
	t."nationalImplementingEntity",
	t."recipientEntities",
	t."status",
	t."technologyType",
	t."timeFrame",
	t."endYear",
	t."startYear",  
	p."subSector",
	a."type",
FROM activity t
LEFT JOIN 
	(
		SELECT
			"projectId",
			"startYear",
			"endYear",
			"programmeId",
			"expectedTimeFrame" as "timeFrame"
		FROM project
	) 
j ON j."projectId" = t."parentId"
LEFT JOIN 
	(
		SELECT
			"programmeId",
			"startYear",
			"actionId",
			"affectedSubSector" as "subSector"
		FROM programme
	) 
p ON p."programmeId" = t."parentId" OR p."programmeId" = j."programmeId"
LEFT JOIN 
	(
		SELECT
			"actionId",
			"startYear",
			"type"
		FROM action
	) 
a ON a."actionId" = t."parentId" OR a."actionId" = p."actionId"
`
// ML: we are now getting startYear, endYear and timeFrame directly from activity
export const annexThreeReportSQL = `
SELECT
    s."supportId",
	s."direction",
	s."internationalSupportChannel",
	s."internationalFinancialInstrument",
	s."financingStatus",
	s."requiredAmount",
	s."requiredAmountDomestic",
	s."receivedAmount",
	s."receivedAmountDomestic",
	s."sector",
	e_act."activityId",
	e_act."title",
	e_act."description",
	e_act."anchoredInNationalStrategy",
	e_act."etfDescription",
	e_act."internationalImplementingEntity",
	e_act."nationalImplementingEntity",
	e_act."status",
	e_act."technologyType",
	e_act."meansOfImplementation",
	e_act."timeFrame",
	e_act."recipientEntities",
	e_act."subSector",
	e_act."type",
	e_act."endYear",
	e_act."startYear"
FROM support s
LEFT JOIN 
    (${expandedActivity})
e_act ON s."activityId" = e_act."activityId"
WHERE 
	s.validated IS TRUE AND s."financeNature" = 'International'
ORDER BY 
    e_act."activityId";
`

@ViewEntity({
	name: 'annex_three_view',
	materialized: false,
	expression: annexThreeReportSQL,
	synchronize: false,
})
export class AnnexThreeViewEntity {

    @Index()
	@ViewColumn()
	supportId: string;

	@ViewColumn()
	activityId: string;

	// From Support Entity

	@ViewColumn()
	direction: string;

	@ViewColumn()
	internationalSupportChannel: string;

	@ViewColumn()
	internationalFinancialInstrument: string;

	@ViewColumn()
	financingStatus: string;

	@ViewColumn()
	requiredAmount: number;
  
	@ViewColumn()
	receivedAmount: number;
  
	@ViewColumn()
	requiredAmountDomestic: number;
  
	@ViewColumn()
	receivedAmountDomestic: number;

	@ViewColumn()
	sector: string;

	// From Activity Entity

	@ViewColumn()
    title: string;

	@ViewColumn()
	description: string;

	@ViewColumn()
	meansOfImplementation: string;

	@ViewColumn()
	anchoredInNationalStrategy: boolean;

	@ViewColumn()
	etfDescription: string;

	@ViewColumn()
	internationalImplementingEntity: string[];

	@ViewColumn()
	nationalImplementingEntity: string[];

	@ViewColumn()
	status: string;

	@ViewColumn()
	technologyType: string;

	@ViewColumn()
    timeFrame: string;
	
	@ViewColumn()
    startYear: string;

	@ViewColumn()
    endYear: string;

	// From Deep Ancestors
    @ViewColumn()
	recipientEntities: string[];

    @ViewColumn()
    subSector: string[];

    @ViewColumn()
    type: string;

}