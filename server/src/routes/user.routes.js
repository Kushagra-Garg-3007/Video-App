import { Router } from "express";
import { registerUser, loginUser, logoutUser, addWatchHistory, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1
  },
  {
    name: "coverImage",
    maxCount: 1
  }
]), registerUser)

router.post('/login', loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.get('/addWatchHistory/:id', verifyJWT, addWatchHistory);
router.get("/getWatchHistory", verifyJWT, getWatchHistory);

export default router;