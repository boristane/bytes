import { Connection, createConnection, getConnectionManager } from "typeorm";

import { User } from "./src/entity/User";
import { app } from "./src/server";
import { Tag } from "./src/entity/Tag";
import { Byte } from "./src/entity/Byte";

async function main() {
  await createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "password",
    database: "bytes",
    entities: [User, Tag, Byte]
  });
  //   await connection.connect();
  app.listen(3333, () => console.log("Server started on port 3333"));
}

main();
