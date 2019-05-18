import { Response } from "express";

export default function send500(res: Response, err) {
  const time = new Date();
  console.error(`${time.toUTCString()}: Internal server error: ${err.stack}`);
  res.status(500).json({
    error: err
  });
}
