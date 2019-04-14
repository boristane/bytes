import { Connection, createConnection } from "typeorm";
import { User } from "../src/entity/User";
import { app } from "../src/server";
import request from "supertest";

let connection: Connection;

beforeAll(async () => {
  connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "bytes",
    entities: [User]
  });
});

it("should respond with 200", async () => {
  const body = {
    name: "wtf"
  };
  const response = await request(app)
    .post("/get-trips")
    .send(body);
  expect(response.status).toBe(404);
});
