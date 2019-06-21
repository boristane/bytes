import { app } from "./src/server";

import createConnectionToDB from "./src/utils/createConnectionToDB";
import messenger from "./src/utils/slack";
import { Request } from "express";
import { ServerResponse } from "http";
import next from "next";

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
  const dev = process.env.ENV !== "prod";
  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();

  const digits = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12
  };

  nextApp
    .prepare()
    .then(() => {
      app.get("/b/:id", (req: Request, res: ServerResponse) => {
        const path = "/post";
        const { id } = req.params;
        return nextApp.render(req, res, path, { id });
      });

      app.get("/p/:page", (req: Request, res: ServerResponse) => {
        const path = "/";
        const { pageLetters } = req.params;
        const page = digits[pageLetters] ? digits[pageLetters] : "1";
        return nextApp.render(req, res, path, { page });
      });

      app.get("/", (req: Request, res: ServerResponse) => {
        const path = "/";
        const page = "1";
        return nextApp.render(req, res, path, { page });
      });

      app.get("*", (req, res) => {
        return handle(req, res);
      });

      app.listen(process.env.PORT, () => {
        const text = `Server started on port ${process.env.PORT}.`;
        console.log(text);
        messenger(`😁 ${text}`);
      });
    })
    .catch(err => {
      console.error(err.stack);
      process.exit(1);
    });
}

main();
