import express from "express";
import usersControler from "../controlers/users";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/all", usersControler.getAll);

router.post("/signup", usersControler.signup);

export default router;
