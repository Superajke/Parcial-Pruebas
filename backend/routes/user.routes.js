import { Router } from "express";
import {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  LogIn,
  logOut,
  verifyToken,
} from "../controller/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", postUser);
router.put("/", updateUser);
router.delete("/", deleteUser);
router.post("/login", LogIn);
router.post("/logout", logOut);
router.get("/verifytoken", verifyToken);

export default router;
