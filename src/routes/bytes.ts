import express from "express";
import { getMany, post, del } from "../controlers/bytes";
import upload from "../controlers/upload";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/", getMany);
router.post("/", auth, upload, post);
router.delete("/", auth, del);
export default router;
