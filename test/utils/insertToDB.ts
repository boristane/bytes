import * as pg from "pg";
require("dotenv").config();

export async function insertUsers() {
  const users = [
    {
      name: "brian",
      email: "brian@lol.com",
      password: "password",
      admin: false
    },
    {
      name: "derek",
      email: "ddb@lewatibg.com",
      password: "gims",
      admin: true
    },
    {
      name: "houre",
      email: "houre@jewanda.com",
      password: "houre",
      admin: false
    }
  ];
  const client = new pg.Client();
  await client.connect();
  const promises = users.map(async (user, index) => {
    const query = {
      text:
        "INSERT INTO public.user(id, name, admin, password, email) VALUES($1, $2, $3, $4, $5)",
      values: [index, user.name, user.admin, user.password, user.email]
    };
    return client.query(query);
  });
  return Promise.all(promises);
}

export default {
  insertUsers
};
