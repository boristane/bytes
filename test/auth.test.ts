import auth from "../src/auth/checkAuth";
import { Connection } from "typeorm";
import * as pg from "pg";
import createConnectionToDB from "../src/utils/createConnectionToDB";
import removeAllFromDB from "./utils/removeAllFromDB";

let connection: Connection;
let pgClient: pg.Client;

beforeAll(async () => {
  connection = await createConnectionToDB();
  pgClient = new pg.Client();
  await pgClient.connect();
  await removeAllFromDB(pgClient);
});

afterEach(async () => {
  await removeAllFromDB(pgClient);
});

afterAll(() => {
  pgClient.end();
});

describe("auth", () => {});
