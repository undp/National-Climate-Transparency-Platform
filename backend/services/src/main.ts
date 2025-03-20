import { handler as asyncHandler } from "./async-operations-handler/handler";
import * as setupHandler from "./setup/handler";
import { NationalAPIModule } from "./national-api/national.api.module";
import { join } from "path";
import { buildNestApp } from "./server";
import { AnalyticsAPIModule } from "./analytics-api/analytics.api.module";
import { existsSync, readFileSync } from "fs";

async function bootstrap() {
  let module: any;
  let httpPath: any;

  const modules = process.env.RUN_MODULE.split(",");
  for (const moduleName of modules) {
    console.log("Starting module", moduleName);
    switch (moduleName) {
      case "national-api":
        module = NationalAPIModule;
        httpPath = "national";
        break;
      case "analytics-api":
        module = AnalyticsAPIModule;
        httpPath = "stats";
        break;
      case "async-operations-handler":
        await asyncHandler();
        console.log("Module initiated", moduleName);
        continue;
      default:
        module = NationalAPIModule;
        httpPath = "national";
    }

    const app = await buildNestApp(module, "/" + httpPath);
    if (moduleName == "national-api") {
      
      if (existsSync('users.csv')) {
        const users = readFileSync("users.csv", "utf8");
        console.log("Inserting users", users);
        await setupHandler.handler({ type: "IMPORT_USERS", body: users });
      }

      const staticPath = join(__dirname, "..", "public");
      console.log("Static file path:", staticPath);
      app.useStaticAssets(staticPath);

      await setupHandler.handler();
    }
    await app.listen(process.env.RUN_PORT || 3000);
    console.log("Module initiated", moduleName);
  }
}
bootstrap();
