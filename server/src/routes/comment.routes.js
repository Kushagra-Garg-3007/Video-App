import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment } from "../controllers/comment.controller.js";
const router = Router();

router.post('/addComment/:id', verifyJWT, addComment);

export default router;
