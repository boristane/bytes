import express from "express";
import { getMany } from "../controlers/bytes";

const router = express.Router();

router.get("/", getMany);
export default router;
