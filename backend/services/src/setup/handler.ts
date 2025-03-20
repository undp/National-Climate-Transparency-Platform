import { NestFactory } from "@nestjs/core";
import { Handler } from "aws-lambda";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { Role, SubRole } from "../casl/role.enum";
import { UserDto } from "../dtos/user.dto";
import { getLogger } from "../server";
import { Sector } from "../enums/sector.enum";
import { GHGInventoryManipulate, SubRoleManipulate, ValidateEntity } from "../enums/user.enum";

export const handler: Handler = async (event: any) => {

  if (!event) {
    event = process.env;
  }

  const userApp = await NestFactory.createApplicationContext(UserModule, {
    logger: getLogger(UserModule),
  });
  const userService = userApp.get(UserService);

  if (event.type === "IMPORT_USERS" && event.body) {

    const users = event.body.split("\n");

    let c = 0;
    for (const user of users) {
      c++;
      if (c === 1) {
        continue;
      }
      let fields = user.split(",");
      if (fields.length < 7) {
        continue;
      }
      fields = fields.map(f => f.trim())
      const userRole =
        fields[4] == "admin"
          ? Role.Admin
          : fields[4] == "GovernmentUser"
          ? Role.GovernmentUser
          : Role.Observer;

			const userSubRole =
					fields[5] == "GovernmentDepartment"
						? SubRole.GovernmentDepartment
						: fields[5] == "Consultant"
						? SubRole.Consultant
						: fields[5] == "SEO"
						? SubRole.SEO
						: fields[5] == "TechnicalReviewer"
						? SubRole.TechnicalReviewer
						: SubRole.DevelopmentPartner;

      const sectors: Sector[] = fields[6] ? fields[6].split("-") : undefined;

      console.log('Inserting user', fields[0],
			fields[3],
			fields[7],
			fields[1],
			userRole,
			userSubRole,
			sectors,
			undefined)
      try {
        await userService.createUserWithPassword(
          fields[0],
          fields[3],
          fields[7],
          fields[1],
          userRole,
					userSubRole,
          fields[2],
					sectors,
          undefined
        );
      } catch (e) {
        console.log('Fail to create user', fields[1])
      }
     
    }
    return;
  }

  const u = await userService.findOne(event["rootEmail"]);

  if (u != undefined) {
      console.log("Root user already created and setup is completed");
      return;
  }

  try {
    const user = new UserDto();
    user.email = event["rootEmail"];
    user.name = "Root";
    user.role = Role.Root;
    user.validatePermission = ValidateEntity.CAN;
    user.subRolePermission = SubRoleManipulate.CAN;
    user.ghgInventoryPermission = GHGInventoryManipulate.CAN;
    user.country = event["systemCountryCode"];
    console.log("Adding user", user);
    await userService.create(user);
  } catch (e) {
    console.log(`User ${event["rootEmail"]} failed to create`, e);
  }
};
