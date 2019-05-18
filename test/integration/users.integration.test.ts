import { Connection, createConnection } from "typeorm";
import { app } from "../../src/server";
import request from "supertest";
import connectToDB from "../../src/utils/connectToDB";
import { insertUsers } from "../utils/insertToDB";
import removeAllFromDB from "../utils/removeAllFromDB";

let connection: Connection;

beforeAll(async () => {
  connection = await connectToDB();
});

it("should return 404 on listing all users on an empty db", async () => {
  const response = await request(app).get("/user/all");

  expect(response.status).toBe(404);
});

it("should list the correct number of users", async () => {
  await insertUsers();
  const response = await request(app).get("/user/all");

  expect(response.status).toBe(200);
});

afterEach(async () => {
  await removeAllFromDB();
});
