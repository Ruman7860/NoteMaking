// importing express
import express from "express";
import { signin, signout, signup } from "../controller/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js"

// creating a router
const router = express.Router();

// Routes
router.post("/signup",signup);
router.post("/signin",signin);
router.get("/signout",verifyToken,signout);

// exporting the route.
export default router;