import * as pg from "pg";
import { hashSync } from "bcrypt";

export function insertUsers(
  client: pg.Client,
  users: Array<{
    name: string;
    admin: boolean;
    password: string;
    email: string;
  }>
): Promise<pg.QueryResult[]> {
  const promises = users.map(async (user, index) => {
    const saltRounds = 10;
    const hashedPassword = hashSync(user.password, saltRounds);
    const query = {
      text:
        "INSERT INTO public.user(id, name, admin, password, email) VALUES($1, $2, $3, $4, $5)",
      values: [index + 1, user.name, user.admin, hashedPassword, user.email]
    };
    return client.query(query);
  });
  return Promise.all(promises);
}

export default {
  insertUsers
};
