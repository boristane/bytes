import express from "express";
import {
  getAll,
  signup,
  login,
  getOne,
  del,
  makeAdmin,
  activate,
  resendActivationToken
} from "../controlers/users";
import auth from "../auth/checkAuth";

const router = express.Router();

router.get("/all", getAll);
router.post("/signup", signup);
router.post("/login", login);
router.post("/send-token", resendActivationToken);
router.post("/make-admin", auth, makeAdmin);
router.get("/", getOne);
router.delete("/", auth, del);
router.get("/activate/:token", activate);

export default router;
