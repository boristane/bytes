import { Connection } from "typeorm";
import { app } from "../../src/server";
import request from "supertest";
import createConnectionToDB from "../../src/utils/createConnectionToDB";
import { insertUsers } from "../utils/insertToDB";
import { removeUsersFromDB } from "../utils/removeAllFromDB";
import users from "../fixtures/users.json";
import { sign } from "jsonwebtoken";
import buildUrl from "../utils/buildURL";
import setupDB from "../utils/setup-db";
import { promisify } from "util";
require("dotenv").config();

jest.setTimeout(15000);

let sleep = promisify(setTimeout);

let connection: Connection;

beforeAll(async () => {
  await setupDB();
  sleep(2000);
  connection = await createConnectionToDB();
});

beforeEach(async () => {
  await removeUsersFromDB();
  await insertUsers(users);
});

afterAll(async () => {
  await insertUsers(users);
});

describe("users listing", () => {
  it("should list the correct number of users", async () => {
    const response = await request(app).get("/api/user/all");
    expect(response.status).toBe(200);
    expect(response.body.count).toBe(users.length);
  });

  it("should return 404 on user not found", async () => {
    const id = 50;
    const params = {
      id
    };
    const url = buildUrl("/api/user/", params);
    const response = await request(app).get(url);

    expect(response.status).toBe(404);
  });

  // it("should return the correct valid user", async () => {
  //   const id = 1;
  //   const params = {
  //     id
  //   };
  //   const url = buildUrl("/api/user/", params);
  //   const response = await request(app).get(url);
  //   expect(response.status).toBe(200);
  //   expect(response.body.user.name).toEqual(users[0].name);
  // });
});

describe("signup", () => {
  it("should signup a non-admin new user", async () => {
    const user = {
      name: "ddb",
      password: "lmao",
      email: "takoudjeu@lybibaf.cm"
    };

    const response = await request(app)
      .post("/api/user/signup")
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body.user.name).toBe(user.name);
    expect(response.body.user.email).toBe(user.email);
  });

  it("should reject double signup", async () => {
    const response = await request(app)
      .post("/api/user/signup")
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
      .post("/api/user/signup")
      .send(user);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Invalid email address.");
  });
});

describe("login", () => {
  it("should fail loging in a non-existing user", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: "blabla@blabla.com",
        password: "jewanda"
      });

    expect(response.status).toBe(401);
  });

  it("should fail loging in a user with a wrong password", async () => {
    const response = await request(app)
      .post("/api/user/login")
      .send({
        email: users[0].email,
        password: "error"
      });

    expect(response.status).toBe(401);
  });

  it("should succesfully login a user", async () => {
    const response = await request(app)
      .post("/api/user/login")
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
    const email = "random@nonexisting.com";
    const params = {
      email
    };
    const url = buildUrl("/api/user/", params);
    const token = sign(users[0].email, process.env.JWT_KEY);
    const response = await request(app)
      .delete(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it("should reject deletion on user without admin rights", async () => {
    const email = users[0].email;
    const params = {
      email
    };
    const url = buildUrl("/api/user/", params);
    const nonAdmins = users.filter(user => !user.admin);
    const token = sign(nonAdmins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .delete(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should succesfully delete a user", async () => {
    const email = users[0].email;
    const params = {
      email
    };
    const url = buildUrl("/api/user/", params);
    const admins = users.filter(user => user.admin);
    const token = sign(admins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .delete(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});

describe("make admin", () => {
  it("should respond with 404 on non-existing user", async () => {
    const email = "non-existing@user.com";
    const params = {
      email
    };
    const url = buildUrl("/api/user/make-admin/", params);
    const token = sign(users[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it("should reject a non admin making others admin", async () => {
    const email = users[0].email;
    const params = {
      email
    };
    const url = buildUrl("/api/user/make-admin", params);
    const nonAdmins = users.filter(user => !user.admin);
    const token = sign(nonAdmins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });

  it("should succesfully make a user admin", async () => {
    const email = users[0].email;
    const params = {
      email
    };
    const url = buildUrl("/api/user/make-admin/", params);
    const admins = users.filter(user => user.admin);
    const token = sign(admins[0].email, process.env.JWT_KEY);

    const response = await request(app)
      .post(url)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
