import * as jwt from "jsonwebtoken";
import { send401 } from "../utils/defaultResponses";

export default function checkAucth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    send401(res);
  }
}
