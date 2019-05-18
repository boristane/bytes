import { Connection, createConnection } from "typeorm";
import { User } from "../src/entity/User";
import { app } from "../src/server";
import request from "supertest";
import connectToDB from "../src/utils/connectToDB";

let connection: Connection;

beforeAll(async () => {
  connection = await connectToDB();
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
