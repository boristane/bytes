import express from "express";
import {
  getAll,
  signup,
  login,
  getOne,
  del,
  makeAdmin,
  activate
} from "../controlers/users";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/all", getAll);

router.post("/signup", signup);

router.post("/login", login);

router.post("/make-admin", auth, makeAdmin);

router.get("/", getOne);

router.delete("/", auth, del);

router.post("/activate/:token", activate);

export default router;
