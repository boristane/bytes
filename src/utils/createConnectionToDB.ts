import { createConnection, Connection } from "typeorm";
import { User } from "../entity/User";
import { Tag } from "../entity/Tag";
import { Byte } from "../entity/Byte";

export default async function createConnectionToDB(): Promise<Connection> {
  const connection = await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "bytes",
    entities: [User, Tag, Byte]
  });

  return connection;
}
