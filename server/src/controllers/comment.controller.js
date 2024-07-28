import { Comment } from "../models/comment.model.js"
import { User } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";

const addComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const videoId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    let video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" })
    }
    const { comment } = req.body;
    if (!comment || comment.trim() == '') {
      return res.status(401).json({ message: "please pass comment" })
    }
    let newComment = await Comment.create({
      user: userId,
      video: videoId,
      comment
    });
    video.comments.push(newComment._id);
    await video.save();

    video = await Video.findById(videoId);
    newComment = await newComment.populate("user");

    return res.status(201).json({ newComment, video });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "Internal server error" });
  }

}

export { addComment };