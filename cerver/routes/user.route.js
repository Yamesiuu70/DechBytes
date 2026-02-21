import { Router } from "express";
import {
  getProfileController,
  updateProfileController,
  loginUserController,
  logoutController,
  registerUserController,
  verifyEmailController,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

/*
Router → creates a modular Express router.
Controllers → functions that handle the logic for user routes.
auth → middleware that protects routes so only logged-in users can access them.login krlo kina setai middlewares>auth.js e
*/

const userRouter = Router();

// Auth routes
userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutController);

// Profile routes
userRouter.get("/profile", auth, getProfileController);
userRouter.put("/profile/update", auth, updateProfileController); // ✅ matches frontend

export default userRouter;
