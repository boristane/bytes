import createConnectionToDB from "../../src/utils/createConnectionToDB";

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

async function main() {
  const connection = await createConnectionToDB();
  await connection.synchronize(true);
  await connection.close();
  console.log("Database initialised.");
}

main();
