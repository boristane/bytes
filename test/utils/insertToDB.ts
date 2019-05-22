import * as pg from "pg";
import { hashSync, hash } from "bcrypt";
import { getConnection } from "typeorm";
import { User } from "../../src/entity/User";
import { Tag } from "../../src/entity/Tag";
import { Byte } from "../../src/entity/Byte";
import { getUserBy } from "../../src/utils/utils";

export function insertUsers(
  users: Array<{
    name: string;
    admin: boolean;
    password: string;
    email: string;
  }>
) {
  const promises = users.map(async (user, index) => {
    const saltRounds = 10;
    const hashedPassword = await hash(user.password, saltRounds);
    const newUser: User = {
      id: index + 1,
      name: user.name,
      email: user.email,
      password: hashedPassword,
      created: new Date(),
      updated: new Date(),
      admin: user.admin,
      activated: false,
      bytes: []
    };
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .orIgnore()
      .into(User)
      .values(newUser)
      .execute();
    return result;
  });
  return Promise.all(promises);
}

export function insertTags(tags: string[]) {
  const promises = tags.map(s => {
    const tag: Tag = {
      name: s,
      created: new Date()
    };
    const result = getConnection()
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(tag)
      .execute();
    return result;
  });

  return Promise.all(promises);
}

export function insertBytes(bytes: Array<IByte>) {
  const promises = bytes.map(async (obj, index) => {
    const t = obj.tags;
    const byte: Byte = {
      title: obj.title,
      image: obj.image,
      body: obj.body,
      created: new Date(new Date().getTime() + index * 6000),
      updated: new Date(new Date().getTime() + index * 6000),
      author: await getUserBy("email", obj.author),
      tags: []
    };

    const result = getConnection()
      .createQueryBuilder()
      .insert()
      .into(Byte)
      .values(byte)
      .execute();
    return result;
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
