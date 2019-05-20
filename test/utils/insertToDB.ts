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
        "INSERT INTO public.user(id, name, admin, password, email, created) VALUES($1, $2, $3, $4, $5, $6)",
      values: [
        index + 1,
        user.name,
        user.admin,
        hashedPassword,
        user.email,
        new Date().toUTCString()
      ]
    };
    return client.query(query);
  });
  return Promise.all(promises);
}

export function insertBytes(
  client: pg.Client,
  bytes: Array<IByte>,
  tags: string[]
): Promise<pg.QueryResult[]> {
  const promises = bytes.map((byte, index) => {
    const query = {
      text: `INSERT INTO public.byte(id, title, image, body, "authorId", created) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        index + 1,
        byte.title,
        byte.image,
        byte.body,
        byte.author,
        new Date(new Date().getTime() + index * 6000).toUTCString()
      ]
    };
    return client.query(query);
  });
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i];
    byte.tags.forEach(tag => {
      const isInTags = tags.indexOf(tag) > -1;
      if (isInTags) {
        const index = tags.indexOf(tag) + 1;
        const query = {
          text:
            'INSERT INTO public.byte_tags_tag("byteId", "tagId") VALUES ($1, $2)',
          values: [i + 1, index]
        };
        promises.push(client.query(query));
      }
    });
  }
  return Promise.all(promises);
}

export function insertTags(
  client: pg.Client,
  tags: string[]
): Promise<pg.QueryResult[]> {
  const promises = tags.map((tag, index) => {
    const query = {
      text: "INSERT INTO public.tag(id, name) VALUES ($1, $2)",
      values: [index + 1, tag]
    };
    return client.query(query);
  });
  return Promise.all(promises);
}

interface IByte {
  title: string;
  image: string;
  body: string;
  tags: Array<string>;
  author: number;
}
