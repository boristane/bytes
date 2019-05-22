import express from "express";
import { getConnection } from "typeorm";
import { User } from "./entity/User";
import usersRouter from "./routes/users";
import bytesRouter from "./routes/bytes";
import { post } from "./controlers/bytes";
import upload from "./controlers/upload";
require("dotenv").config();

export const app = express();
app.use(express.json());

app.use("/user/", usersRouter);
app.use("/byte/", bytesRouter);
// app.post("/byte", upload, post);
