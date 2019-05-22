import { Connection, getConnection } from "typeorm";
import { app } from "../../src/server";
import request from "supertest";
import createConnectionToDB from "../../src/utils/createConnectionToDB";
import { insertUsers, insertTags, insertBytes } from "../utils/insertToDB";
import { removeAllFromDB, removeTableFromDB } from "../utils/removeAllFromDB";
import users from "../fixtures/users.json";
import tags from "../fixtures/tags.json";
import bytes from "../fixtures/bytes.json";
import { sign } from "jsonwebtoken";
import buildUrl from "../utils/buildURL";
import { promisify } from "util";
require("dotenv").config();

jest.setTimeout(15000);

let sleep = promisify(setTimeout);

let connection: Connection;

beforeAll(async () => {
  connection = await createConnectionToDB();
  await removeAllFromDB();
  await insertUsers(users);
  await insertTags(tags);
  await insertBytes(bytes);
  await sleep(2000);
});

// describe("bytes listing", () => {
//   it("should list the first 10 bytes on page 1", async () => {
//     await removeAllFromDB();

//     await insertUsers(users);
//     await insertTags(tags);
//     await insertBytes(bytes);
//     const params = {
//       page: 1
//     };
//     const url = buildUrl("/byte/", params);
//     const page1Bytes = bytes
//       .slice(0, 10)
//       .map(byte => byte.title)
//       .sort();
//     const response = await request(app).get(url);
//     const actual = response.body.bytes.map(byte => byte.title).sort();
//     expect(response.status).toBe(200);
//     expect(response.body.count).toBe(10);
//     expect(actual).toEqual(page1Bytes);
//   });

//   it("should list the second page", async () => {
//     await removeAllFromDB();

//     await insertUsers(users);
//     await insertTags(tags);
//     await insertBytes(bytes);
//     const params = {
//       page: 2
//     };
//     const url = buildUrl("/byte/", params);
//     const page2Bytes = bytes
//       .slice(10, 20)
//       .map(byte => byte.title)
//       .sort();
//     const response = await request(app).get(url);
//     const actual = response.body.bytes.map(byte => byte.title).sort();
//     expect(response.status).toBe(200);
//     expect(response.body.count).toBe(10);
//     expect(actual).toEqual(page2Bytes);
//   });

//   it("should list the last page", async () => {
//     await removeAllFromDB();

//     await insertUsers(users);
//     await insertTags(tags);
//     await insertBytes(bytes);
//     const params = {
//       page: 3
//     };
//     const url = buildUrl("/byte/", params);
//     const page3Bytes = bytes
//       .slice(20)
//       .map(byte => byte.title)
//       .sort();
//     const response = await request(app).get(url);
//     expect(response.status).toBe(200);
//     expect(response.body.count).toBe(page3Bytes.length);
//     const actual = response.body.bytes.map(byte => byte.title).sort();

//     expect(actual).toEqual(page3Bytes);
//   });
// });

describe("byte posting", () => {
  it("should successfully post a byte", async () => {
    await removeAllFromDB();

    await insertUsers(users);
    await insertTags(tags);
    await insertBytes(bytes);
    const token = sign(users[0].email, process.env.JWT_KEY);
    const response = await request(app)
      .post("/byte/")
      .set("Authorization", `Bearer ${token}`)
      .field("title", "A random byte")
      .field("tags", "music, rpg, elements")
      .attach("body", "test/fixtures/body.md")
      .attach("image", "test/fixtures/image.png");

    expect(response.status).toBe(200);
  });
});
