import { createConnection, Connection } from "typeorm";
import { User } from "../entity/User";
import { Tag } from "../entity/Tag";
import { Byte } from "../entity/Byte";
import { ActivationToken } from "../entity/ActivationToken";

export default async function createConnectionToDB(): Promise<Connection> {
  const connection = await createConnection({
    type: "postgres",
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT, 10),
    username: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    entities: [User, Tag, Byte, ActivationToken]
  });

  return connection;
}
