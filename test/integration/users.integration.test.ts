import { Connection } from "typeorm";
import { app } from "../../src/server";
import request from "supertest";
import createConnectionToDB from "../../src/utils/createConnectionToDB";
import { insertUsers } from "../utils/insertToDB";
import removeAllFromDB from "../utils/removeAllFromDB";
import users from "../fixtures/users.json";
import * as pg from "pg";

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

describe("users listing", () => {
  it("should return 404 on listing all users on an empty db", async () => {
    const response = await request(app).get("/user/all");
    expect(response.status).toBe(404);
  });

  it("should list the correct number of users", async () => {
    await insertUsers(pgClient, users);
    const response = await request(app).get("/user/all");
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(users.length);
  });
});

describe("signup", () => {
  it("should signup a non-admin new user", async () => {
    const user = {
      name: "ddb",
      password: "lmao",
      email: "takoudjeu@lybibaf.cm"
    };

    const response = await request(app)
      .post("/user/signup")
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body.user.name).toBe(user.name);
    expect(response.body.user.email).toBe(user.email);
  });

  it("should reject double signup", async () => {
    await insertUsers(pgClient, users);
    const response = await request(app)
      .post("/user/signup")
      .send(users[0]);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe("User already created.");
  });

  it("should reject invalid email signup", async () => {
    const user = {
      name: "ddb",
      password: "lmao",
      email: "takoudjeu-lybibaf.cm"
    };

    const response = await request(app)
      .post("/user/signup")
      .send(user);

    expect(response.status).toBe(500);
  });
});
