import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Tag } from "../entity/Tag";
import { Byte } from "../entity/Byte";

export async function getUserBy(column: string, value): Promise<User> {
  const userRepository = getRepository(User);
  const options = {};
  options[column] = value;
  const user = await userRepository
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where(`user.${column} = :${column}`, options)
    .getOne();
  return user;
}

export async function getByteBy(column: string, value): Promise<Byte> {
  const byteRepository = getRepository(Byte);
  const options = {};
  options[column] = value;
  const byte = await byteRepository
    .createQueryBuilder()
    .select("byte")
    .from(Byte, "byte")
    .where(`byte.${column} = :${column}`, options)
    .getOne();
  return byte;
}

export async function getTagBy(colum: string, value): Promise<Tag> {
  const tagRepository = getRepository(Tag);
  const options = {};
  options[colum] = value;
  const tag = await tagRepository
    .createQueryBuilder()
    .select("tag")
    .from(Tag, "tag")
    .where(`tag.${colum} = : ${colum}`, options)
    .getOne();
  return tag;
}
