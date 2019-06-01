import express from "express";
import { getMany, post, del, getOne } from "../controlers/bytes";
import upload from "../controlers/upload";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/list", getMany);
router.get("/", getOne);
if (process.env.ENV === "prod") {
  router.post("/", auth, upload, post);
} else {
  router.post("/", auth, post);
}
router.delete("/", auth, del);
export default router;
