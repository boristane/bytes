import { app } from "./src/server";

import createConnectionToDB from "./src/utils/createConnectionToDB";

async function main() {
  await createConnectionToDB();
  app.listen(process.env.PORT, () =>
    console.log(`Server started on port ${process.env.PORT}`)
  );
}

main();
