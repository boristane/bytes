import express from "express";
import { getMany, post } from "../controlers/bytes";
import upload from "../controlers/upload";

const router = express.Router();

router.get("/", getMany);
router.post("/", upload, post);
export default router;
