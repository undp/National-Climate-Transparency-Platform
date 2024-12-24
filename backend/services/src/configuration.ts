export default () => ({
  stage: process.env.STAGE || "local",
  systemCountry: process.env.systemCountryCode || "NG",
  systemCountryName: process.env.systemCountryName || "CountryX",
  systemCountryGovernmentName: process.env.systemCountryGovernmentName || "Government of CountryX",
  systemContinentName: process.env.systemContinentName || "CountryX",
  defaultCreditUnit: process.env.defaultCreditUnit || "ITMO",
  year: parseInt(process.env.REPORT_YEAR),
  dateTimeFormat: "DD LLLL yyyy @ HH:mm",
  dateFormat: "DD LLLL yyyy",
  database: {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "hquser",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "carbondev",
    synchronize: process.env.NODE_ENV == "prod" ? true : true,
    autoLoadEntities: true,
    logging: ["error"],
  },
  jwt: {
    expiresIn: process.env.EXPIRES_IN || "7200",
    userSecret: process.env.USER_JWT_SECRET || "1324",
    adminSecret: process.env.ADMIN_JWT_SECRET || "8654",
    encodePassword: process.env.ENCODE_PASSWORD || false
  },
  email: {
    source: process.env.SOURCE_EMAIL || "info@xeptagon.com", 
    endpoint:
      process.env.SMTP_ENDPOINT ||
      "vpce-02cef9e74f152b675-b00ybiai.email-smtp.us-east-1.vpce.amazonaws.com",
    username: process.env.SMTP_USERNAME || "AKIAUMXKTXDJIOFY2QXL",
    password: process.env.SMTP_PASSWORD,
    disabled: process.env.IS_EMAIL_DISABLED === "true" ? true : false,
    disableLowPriorityEmails:
      process.env.DISABLE_LOW_PRIORITY_EMAIL === "true" ? true : false,
    getemailprefix: process.env.EMAILPREFIX || "",
    adresss: process.env.HOST_ADDRESS || "Address <br>Region, Country Zipcode"
  },
  s3CommonBucket: {
    name: process.env.S3_COMMON_BUCKET || "carbon-common-dev",
  },
  host: process.env.HOST || "https://test.carbreg.org",
  backendHost: process.env.BACKEND_HOST || "http://localhost:3000",
  liveChat: "https://undp2020cdo.typeform.com/to/emSWOmDo",
  asyncQueueName:
    process.env.ASYNC_QUEUE_NAME ||
    "https://sqs.us-east-1.amazonaws.com/302213478610/AsyncQueuedev.fifo",
  cadTrust: {
    enable: process.env.CADTRUST_ENABLE === "true" ? true : false,
    endpoint: process.env.CADTRUST_ENDPOINT || "http://44.212.139.61:31310/"
  },
  systemType: process.env.SYSTEM_TYPE || "CARBON_UNIFIED_SYSTEM",
  systemName: process.env.SYSTEM_NAME || "SystemX",
});
