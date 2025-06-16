import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import e from "express";
import { QueryDto } from "../dtos/query.dto";
import { ConfigService } from "@nestjs/config";
import { I18nService } from "nestjs-i18n";
import { EntityManager } from "typeorm";
import { SubpathDto } from "../dtos/subpath.dto";
import { User } from "../entities/user.entity";
import { Sector } from "../enums/sector.enum";
import { ValidateEntity } from "../enums/user.enum";
import { Role } from "../casl/role.enum";

@Injectable()
export class HelperService {
  constructor(
    private configService: ConfigService,
    private i18n: I18nService
  ) {}
  
  private prepareValue(value: any, table?: string, toLower?: boolean) {
    if (value instanceof Array) {
      return "(" + value.map((e) => `'${e}'`).join(",") + ")";
    } else if (this.isQueryDto(value)) {
      return this.generateWhereSQL(value, undefined, table);
    } else if (typeof value === "string") {
      if (value === "NULL") {
        return value;
      }
      if (toLower != true) {
        return "'" + value + "'";
      } else {
        return "LOWER('" + value + "')";
      }
    }
    return value;
  }

  private prepareKey(col: string, table?: string) {
    let key;
    if (col.includes("->>")) {
      const parts = col.split("->>");
      key = `"${parts[0]}"->>'${parts[1]}'`;
    } else {
      key = `"${col}"`;
    }
    return `${table ? table + "." : ""}${key}`;
  }

  private isLower(key: string) {
    if (
      [
        "email",
        "name",
        "companyName",
        "taxId",
        "country",
        "title",
        "externalId",
        "serialNo",
        "programmeTitle",
        "programmeName",
        "id",
        "actionId",
        "programmeId",
        "projectId",
        "activityId",
        "supportId",
      ].includes(key)
    )
      return true;
  }

  public generateRandomPassword() {
    var pass = "";
    var str =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@$";

    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  public formatReqMessagesString(langTag: string, vargs: any[]) {
    const str: any = this.i18n.t(langTag);
    const parts: any = str.split("{}");
    let insertAt = 1;
    for (const arg of vargs) {
      parts.splice(insertAt, 0, arg);
      insertAt += 2;
    }
    return parts.join("");
  }

  private isQueryDto(obj) {
    if (
      obj &&
      typeof obj === "object" &&
      (obj["filterAnd"] || obj["filterOr"])
    ) {
      return true;
    }
    return false;
  }

  public generateWhereSQL(query: QueryDto, extraSQL: string, table?: string, ignoreCol?: string[]) {
    let sql = "";
    if (query.filterAnd) {
      if (ignoreCol) {
        query.filterAnd = query.filterAnd.filter(e=> (ignoreCol.indexOf(e.key) >= 0))
      }
      sql += query.filterAnd
        .map((e) => {
          if (this.isQueryDto(e.value)) {
            return `(${this.prepareValue(e.value, table)})`;
          } else if (e.operation === "ANY") {
            return `${this.prepareValue(
              e.value,
              table
            )} = ANY(${this.prepareKey(e.key, table)})`;
          } else if (e.keyOperation) {
            return `${e.keyOperation}(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else if (this.isLower(e.key) && typeof e.value === "string") {
            return `LOWER(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else {
            return `${this.prepareKey(e.key, table)} ${
              e.operation
            } ${this.prepareValue(e.value, table)}`;
          }
        })
        .join(" and ");
    }
    if (query.filterOr) {
      if (ignoreCol) {
        query.filterOr = query.filterOr.filter(e=> (ignoreCol.indexOf(e.key) >= 0))
      }
      const orSQl = query.filterOr
        .map((e) => {
          if (this.isQueryDto(e.value)) {
            return `(${this.prepareValue(e.value, table)})`;
          } else if (e.operation === "ANY") {
            return `${this.prepareValue(
              e.value,
              table
            )} = ANY(${this.prepareKey(e.key, table)})`;
          } else if (e.keyOperation) {
            return `${e.keyOperation}(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else if (this.isLower(e.key) && typeof e.value === "string") {
            return `LOWER(${this.prepareKey(e.key, table)}) ${
              e.operation
            } ${this.prepareValue(e.value, table, true)}`;
          } else {
            return `${this.prepareKey(e.key, table)} ${
              e.operation
            } ${this.prepareValue(e.value, table)}`;
          }
        })
        .join(" or ");
      if (sql != "") {
        sql = `(${sql}) and (${orSQl})`;
      } else {
        sql = orSQl;
      }
    }

    if (sql != "") {
      if (extraSQL) {
        sql = `(${sql}) and (${extraSQL})`;
      }
    } else if (extraSQL) {
      sql = extraSQL;
    }
    // console.log(sql);

    return sql;
  }

  public parseMongoQueryToSQL(mongoQuery, isNot = false, key = undefined) {
    return this.parseMongoQueryToSQLWithTable(
      undefined,
      mongoQuery,
      isNot,
      key
    );
  }

  public parseMongoQueryToSQLWithTable(
    table,
    mongoQuery,
    isNot = false,
    key = undefined
  ) {
    let final = undefined;
    for (let operator in mongoQuery) {
      if (operator.startsWith("$")) {
        if (operator == "$and" || operator == "$or") {
          const val = mongoQuery[operator]
            .map((st) => this.parseMongoQueryToSQLWithTable(table, st))
            .join(` ${operator.replace("$", "")} `);
          final = final == undefined ? val : `${final} and ${val}`;
        } else if (operator == "$not") {
          return this.parseMongoQueryToSQLWithTable(
            table,
            mongoQuery["$not"],
            !isNot
          );
        } else if (operator == "$eq") {
          const value =
            typeof mongoQuery["$eq"] === "number"
              ? String(mongoQuery["$eq"])
              : `'${mongoQuery["$eq"]}'`;
          return `${table ? table + "." : ""}"${key}" ${
            isNot ? "!=" : "="
          } ${value}`;
        } else if (operator == "$ne") {
          const value =
            typeof mongoQuery["$ne"] === "number"
              ? String(mongoQuery["$ne"])
              : `'${mongoQuery["$ne"]}'`;
          return `${table ? table + "." : ""}"${key}" ${
            isNot ? "=" : "!="
          } ${value}`;
        } else if (operator == "$in") {
          const value = `('${mongoQuery["$in"].join("', '")}')`;
          return `${table ? table + "." : ""}"${key}" ${
            isNot ? " NOT IN " : " IN "
          } ${value}`;
        } else if (operator == "$elemMatch") {
          return `'${mongoQuery["$elemMatch"]["$eq"]}' ${
            isNot ? " <> ANY " : " = "
          }(${table ? table + "." : ""}"${key}")`;
        } else if (operator == "$exists") {
					const value = mongoQuery["$exists"]
          return `${table ? table + "." : ""}"${key}" ${
            value ? "IS NOT NULL" : "IS NULL"
          }`;
        }
      } else {
        return this.parseMongoQueryToSQLWithTable(
          table,
          mongoQuery[operator],
          isNot,
          operator
        );
      }
    }
    return final;
  }

	public async refreshMaterializedViews(entityManager: EntityManager) {
    await entityManager.query(`
                              UPDATE support
                              SET sector = activity.sector::VARCHAR
                              FROM activity
                              WHERE support."activityId" = activity."activityId";`);
    await entityManager.query('REFRESH MATERIALIZED VIEW CONCURRENTLY activity_view_entity;');
		await entityManager.query('REFRESH MATERIALIZED VIEW CONCURRENTLY project_view_entity;');
		await entityManager.query('REFRESH MATERIALIZED VIEW CONCURRENTLY programme_view_entity;');
		await entityManager.query('REFRESH MATERIALIZED VIEW CONCURRENTLY action_view_entity;');
		await entityManager.query('REFRESH MATERIALIZED VIEW CONCURRENTLY report_five_view_entity;');
	}

  public getEmailTemplateMessage(template: string, data, isSubject: boolean) :string {
      if (template == undefined) {
          return template;
      }
      for (const key in data) {
          if (data.hasOwnProperty(key)) {
              var find = `{{${key}}}`;
              var re = new RegExp(find, 'g');
              template = template.replace(re, data[key]);
          }
      }

      if(isSubject) {
        return `${this.configService.get("email.getemailprefix")} National Climate Transparency Platform: ${template}`;
      } else {
        return template;
      } 
  }

  public roundToTwoDecimals(value: number): number {
    return parseFloat(value.toFixed(2));
  }

  public generateSubPathSQL(query: SubpathDto) {
    let whereSQL = `subpath(${query.ltree}, ${query.startLevel}, ${query.traverseDepth}) = '${query.match}'`;
    return whereSQL;
  }

  public doesUserHaveSectorPermission(user: User, sectorScope: Sector) {
    let can: boolean = true;
    if (user.sector && user.sector.length > 0 && sectorScope) {
      if (!user.sector.includes(sectorScope)) {
        can = false
      }
    }
    return can;
  }

  public doesUserHaveValidatePermission(user: User) {
    if (user.validatePermission===ValidateEntity.CANNOT) {
      throw new HttpException(
        this.formatReqMessagesString(
          "common.permissionDeniedForValidate",
          [],
        ),
        HttpStatus.FORBIDDEN
      );
    }
  }

  public isValidYear(yearStr: string): boolean {
    const yearRegex = /^\d{4}$/;

    if (yearRegex.test(yearStr)) {
        const year = parseInt(yearStr, 10);
        if (year >= 1000 && year <= 9999) {
            return true;
        }
    }
    return false;
  }

}
