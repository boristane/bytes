import express from "express";
import {
  getAll,
  signup,
  login,
  getOne,
  del,
  makeAdmin
} from "../controlers/users";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/all", getAll);

router.post("/signup", signup);

router.post("/login", login);

router.post("/make-admin/:id", auth, makeAdmin);

router.get("/:id", getOne);

router.delete("/delete/:id", auth, del);

export default router;
