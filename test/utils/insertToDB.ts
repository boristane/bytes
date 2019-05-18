import * as pg from "pg";

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
