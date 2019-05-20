import { auth } from "../../src/auth/checkAuth";
import { sign } from "jsonwebtoken";
import users from "../fixtures/users.json";
require("dotenv").config();

describe("auth", () => {
  it("should reject a random token", () => {
    const token = "haknelan";
    expect(() => auth(token)).toThrow();
  });
  it("should reject a token created with a different secret key", () => {
    const fakeKey = "lmao";
    const token = sign(users[0].email, fakeKey);
    expect(() => auth(token)).toThrow();
  });
  it("should decode a token generated with the appropriate secret key", () => {
    const token = sign(users[0].email, process.env.JWT_KEY);
    const decoded = auth(token);
    expect(decoded).toBeTruthy();
    expect(decoded).toEqual(users[0].email);
  });
});
