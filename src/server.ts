import express from "express";
import { getConnection } from "typeorm";
import { User } from "./entity/User";
export const app = express();
app.use(express.json());

app.post("/user/update", updateUser);

async function updateUser(
  req: express.Request,
  res: express.Response
) {
  const data = req.body;

  const connection = getConnection();

  const results = await connection.getRepository(User).find({
    name: data.name
  });

  if (results.length <= 0) {
    res.status(200).json({
      lmao: "haha"
    });
  }
}
