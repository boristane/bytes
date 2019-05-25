import express from "express";
import usersRouter from "./routes/users";
import bytesRouter from "./routes/bytes";
require("dotenv").config();

export const app = express();
app.use(express.json());

app.use("/user/", usersRouter);
app.use("/byte/", bytesRouter);
