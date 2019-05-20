import { Connection } from "typeorm";
import { app } from "../../src/server";
import request from "supertest";
import createConnectionToDB from "../../src/utils/createConnectionToDB";
import { insertUsers, insertTags, insertBytes } from "../utils/insertToDB";
import removeAllFromDB from "../utils/removeAllFromDB";
import users from "../fixtures/users.json";
import tags from "../fixtures/tags.json";
import bytes from "../fixtures/bytes.json";
import * as pg from "pg";
import { sign } from "jsonwebtoken";
import buildUrl from "../utils/buildURL";
require("dotenv").config();

let connection: Connection;
let pgClient: pg.Client;

beforeAll(async () => {
  connection = await createConnectionToDB();
  pgClient = new pg.Client();
  await pgClient.connect();
  await removeAllFromDB(pgClient);
  await insertUsers(pgClient, users);
  await insertTags(pgClient, tags);
  await insertBytes(pgClient, bytes, tags);
});

afterAll(() => {
  pgClient.end();
});

describe("bytes listing", () => {
  it("should list the first 10 bytes on page 1", async () => {
    const params = {
      page: 1
    };
    const url = buildUrl("/byte/", params);
    const page1Bytes = bytes
      .slice(0, 10)
      .map(byte => byte.title)
      .sort();
    const response = await request(app).get(url);
    const actual = response.body.bytes.map(byte => byte.title).sort();
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(10);
    expect(actual).toEqual(page1Bytes);
  });

  it("should list the second page", async () => {
    const params = {
      page: 2
    };
    const url = buildUrl("/byte/", params);
    const page2Bytes = bytes
      .slice(10, 20)
      .map(byte => byte.title)
      .sort();
    const response = await request(app).get(url);
    const actual = response.body.bytes.map(byte => byte.title).sort();
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(10);
    expect(actual).toEqual(page2Bytes);
  });

  it("should list the last page", async () => {
    const params = {
      page: 3
    };
    const url = buildUrl("/byte/", params);
    const page3Bytes = bytes
      .slice(20)
      .map(byte => byte.title)
      .sort();
    const response = await request(app).get(url);
    const actual = response.body.bytes.map(byte => byte.title).sort();
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(page3Bytes.length);
    expect(actual).toEqual(page3Bytes);
  });
});
