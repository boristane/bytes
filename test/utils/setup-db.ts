import createConnectionToDB from "../../src/utils/createConnectionToDB";
import users from "../fixtures/users.json";
import tags from "../fixtures/tags.json";
import bytes from "../fixtures/bytes.json";
import { insertUsers, insertTags, insertBytes } from "./insertToDB";

const expectedEnvVariables = [
  "PGHOST",
  "PGPORT",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD"
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
  process.exit(1);
}

async function populateDB() {
  await insertUsers(users);
  await insertTags(tags);
  await insertBytes(bytes);
}

export default async function main() {
  const connection = await createConnectionToDB();
  await connection.synchronize(true);
  console.log("Database initialised.");
  await populateDB();
  console.log("Database populated.");
  await connection.close();
}

export async function justSetupDb() {
  const connection = await createConnectionToDB();
  await connection.synchronize(true);
  console.log("Database initialised.");
  await connection.close();
}
