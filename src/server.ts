import express from "express";
import usersRouter from "./routes/users";
import bytesRouter from "./routes/bytes";
require("dotenv").config();

export const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  return next();
});

app.use("/api/user/", usersRouter);
app.use("/api/byte/", bytesRouter);
