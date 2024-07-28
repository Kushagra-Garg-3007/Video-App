import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { uploadVideo, deleteVideo, editVideo, getVideos, findVideo, incCount, ownerVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();


router.post('/uploadVideo', verifyJWT, upload.single('video'), uploadVideo);
router.post('/deleteVideo/:id', verifyJWT, deleteVideo);
router.post('/editVideo/:id', verifyJWT, editVideo);
router.get('/getVideos', getVideos);
router.get('/findVideo/:id', findVideo);
router.get("/incCount/:id", incCount);
router.get("/ownerVideo", verifyJWT, ownerVideo);


export default router;