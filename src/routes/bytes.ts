import express from "express";
import { getMany, post, del, getOne, count } from "../controlers/bytes";
import upload from "../controlers/upload";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/list", getMany);
router.get("/count", count);
router.get("/:id", getOne);
router.post("/", auth, upload, post);
router.delete("/:id", auth, del);
export default router;
