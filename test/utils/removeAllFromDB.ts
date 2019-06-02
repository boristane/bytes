import { getConnection } from "typeorm";
import { Tag } from "../../src/entity/Tag";
import { User } from "../../src/entity/User";
import { Byte } from "../../src/entity/Byte";

export function removeAllFromDB() {
  const promises = [];
  promises.push(
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(Tag)
      .execute()
  );
  promises.push(
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(Byte)
      .execute()
  );
  promises.push(
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute()
  );
  return Promise.all(promises);
}

export function removeUsersFromDB() {
  const promises = [];
  promises.push(
    getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .execute()
  );
  return Promise.all(promises);
}
