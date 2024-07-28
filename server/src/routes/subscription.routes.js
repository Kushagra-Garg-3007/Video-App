import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribers, subscribe } from "../controllers/subscription.controller.js";
const router = Router();

router.get('/subscribe/:id', verifyJWT, subscribe);
router.get('/getSubscribers', verifyJWT, getSubscribers);
export default router;
