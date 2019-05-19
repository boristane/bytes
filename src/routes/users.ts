import express from "express";
import { getAll, signup, login, getOne, del } from "../controlers/users";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/all", getAll);

router.post("/signup", signup);

router.post("/login", login);

router.get("/:id", getOne);

router.post("/delete/:id", del);

export default router;
