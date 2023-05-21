import {
  COMPANY_CODE,
  EMPLOYEE_CODE,
  LOCATION,
  PASSWORD,
  SRV_LOCATION,
} from "./config";
import logger from "./lib/bunyan";
import Apollo from "./services/apollo";

const Action = {
  UP: "up",
  DOWN: "down",
} as const;
type Action = (typeof Action)[keyof typeof Action];

const companyCode = COMPANY_CODE as string;
const employeeCode = EMPLOYEE_CODE as string;
const password = PASSWORD as string;
const serviceLocation = SRV_LOCATION as string;

async function up() {
  const service = new Apollo({
    companyCode,
    employeeCode,
    password,
    serviceLocation,
  });

  try {
    // get code by login api
    const loginData = await service.login();
    // get id token
    const accessToken = await service.fetchAccessToken(loginData.data.code);
    // punch with 1 to check-in
    const resp = await service.punch(
      1,
      accessToken.data.idToken,
      LOCATION as string
    );

    logger.info(`success to up`);
  } catch (error) {
    logger.error(error);
  }
}

async function down() {
  const service = new Apollo({
    companyCode,
    employeeCode,
    password,
    serviceLocation,
  });

  try {
    // get code by login api
    const loginData = await service.login();
    // get id token
    const accessToken = await service.fetchAccessToken(loginData.data.code);
    // punch with 1 to check-in
    const resp = await service.punch(
      2,
      accessToken.data.idToken,
      LOCATION as string
    );

    logger.info(`success to down`);
  } catch (error) {
    logger.error(error);
  }
}

async function main(action: Action) {
  switch (action) {
    case Action.UP:
      return up();
    case Action.DOWN:
      return down();
    default:
      throw new Error("No action matched");
  }
}

const actionArg = process.argv[2] as Action;

main(actionArg).catch((error) => {
  logger.error(error);

  setTimeout(() => {
    process.exit(1);
  }, 1000);
});
