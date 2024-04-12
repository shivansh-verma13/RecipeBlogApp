import express from "express";
import {
  logout,
  userLogin,
  userSignUp,
  verifyUser,
} from "../controllers/user-controllers.js";
import { verifyToken } from "../utils/token-manager.js";
import {
  loginValidator,
  signupValidator,
  validate,
} from "../utils/validators.js";

const router = express.Router();

router.post("/register", validate(signupValidator), userSignUp);
router.post("/login", validate(loginValidator), userLogin);
router.get("/auth-status", verifyToken, verifyUser);
router.get("/logout", verifyToken, logout);

export { router as userRouter };
