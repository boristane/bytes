import { app } from "./src/server";

import createConnectionToDB from "./src/utils/createConnectionToDB";
import messenger from "./src/utils/slack";

const expectedEnvVariables = [
  "JWT_KEY",
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD",
  "URL",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_ACCESS_KEY_ID",
  "BUCKET",
  "DOMAIN",
  "MAILGUN_KEY",
  "PORT",
  "SLACK_HOOK_URL",
  "ENV"
];

const missingEnvVariables = [];

expectedEnvVariables.forEach(variable => {
  if (!process.env[variable]) {
    missingEnvVariables.push(variable);
  }
});

if (missingEnvVariables.length >= 1) {
  const text = `Missing environement variables: ${missingEnvVariables.join(
    ", "
  )}`;
  console.error(text);
  messenger(`⚒️ ${text}`);
  process.exit(1);
}

async function main() {
  await createConnectionToDB();
  app.listen(process.env.PORT, () => {
    const text = `Server started on port ${process.env.PORT}.`;
    console.log(text);
    messenger(`😁 ${text}`);
  });
}

main();
