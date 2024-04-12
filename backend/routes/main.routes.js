import { Router } from "express";
import userRoute from "./user.routes.js";

const router = Router();

router.use("/users", userRoute);

export default router;
