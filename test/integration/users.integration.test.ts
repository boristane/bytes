import { Connection } from "typeorm";
import { app } from "../../src/server";
import request from "supertest";
import createConnectionToDB from "../../src/utils/createConnectionToDB";
import { insertUsers } from "../utils/insertToDB";
import removeAllFromDB from "../utils/removeAllFromDB";
import users from "../fixtures/users.json";
import * as pg from "pg";
import { sign } from "jsonwebtoken";

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

  it("should return 404 on user not found", async () => {
    const id = 3;
    const response = await request(app).get(`/user/${id}`);

    expect(response.status).toBe(404);
  });

  it("should return the correct valid user", async () => {
    await insertUsers(pgClient, users);
    const id = 1;
    const response = await request(app).get(`/user/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.user.name).toEqual(users[id - 1].name);
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
    expect(response.body.message).toBe("Invalid email address.");
  });
});

describe("login", () => {
  it("should fail loging in a non-existing user", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        email: "blabla@blabla.com",
        password: "jewanda"
      });

    expect(response.status).toBe(401);
  });

  it("should fail loging in a user with a wrong password", async () => {
    await insertUsers(pgClient, users);
    const response = await request(app)
      .post("/user/login")
      .send({
        email: users[0].email,
        password: "error"
      });

    expect(response.status).toBe(401);
  });

  it("should succesfully login a user", async () => {
    await insertUsers(pgClient, users);
    const response = await request(app)
      .post("/user/login")
      .send({
        email: users[0].email,
        password: users[0].password
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Authentication successful.");
    expect(response.body.token).toBeTruthy();
  });
});

describe("delete", () => {
  it("should respond with 404 on non-existing user", async () => {
    const id = 3;
    const token = sign(users[0].email, process.env.JWT_KEY);
    const response = await request(app)
      .delete(`/user/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should reject deletion on user without admin rights", async () => {
    await insertUsers(pgClient, users);
    const id = 1;
    const nonAdmins = users.filter(user => !user.admin);
    const token = sign(nonAdmins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .delete(`/user/delete/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should succesfully delete a user", async () => {
    await insertUsers(pgClient, users);
    const id = 1;
    const admins = users.filter(user => user.admin);
    const token = sign(admins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .delete(`/user/delete/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe("make admin", () => {
  it("should respond with 404 on non-existing user", async () => {
    const id = 3;
    const token = sign(users[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .post(`/user/make-admin/${id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it("should reject a non admin making others admin", async () => {
    await insertUsers(pgClient, users);
    const id = 1;
    const nonAdmins = users.filter(user => !user.admin);
    const token = sign(nonAdmins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .post(`/user/make-admin/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should succesfully make a user admin", async () => {
    await insertUsers(pgClient, users);
    const id = 1;
    const admins = users.filter(user => user.admin);
    const token = sign(admins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .post(`/user/make-admin/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
