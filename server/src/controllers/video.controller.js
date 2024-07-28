import { Video } from "../models/videoModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Subscription } from "../models/subscription.model.js";
import dotenv from 'dotenv';
import { User } from "../models/userModel.js";
import { transporter } from "../utils/nodemailerTransport.js";
dotenv.config();

const uploadVideo = async (req, res) => {
  try {
    const owner = req.user?._id;
    const user = await User.findById(owner);

    if(!user.isCreater){
      return res.status(401).json({message:"Sorry you are not a creater."})
    }
    
    const { thumbnail, title, description } = req.body;
    if (!thumbnail || !title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!owner) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const upload = await uploadOnCloudinary(req.file.path);
    const videoFile = upload.url;
    const duration = upload.duration;
    const video = await Video.create({ thumbnail, title, description, videoFile, duration, owner });

    let subscriptions = await Subscription.find({ channel: owner }).populate("subscriber");
    let subscriberEmails = subscriptions.map((subscription) => subscription.subscriber.email);

    if (subscriberEmails.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriberEmails.join(','),
        subject: 'New Video Uploaded',
        html: `<h1>New Video Uploaded</h1><p>A new video titled "${title}" has been uploaded by ${user.userName} . Check it out <a href="http://localhost:5173/VideoPlay/${video._id}">here</a>.</p>`
      };
      // Send email to all subscribers
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }

    res.status(201).json({ message: "Video uploaded successfully", video });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);

    if (!video) return res.status(404).json({ message: "Video not found" });
    const user = req.user._id;

    const owner = video.owner;

    if (owner.toString() === user.toString()) {
      const response = await Video.findByIdAndDelete(video._id);
      return res.status(201).json({ message: "deleted suceesfully" });
    } else {
      return res.status(401).json({ message: "Sorry! you don't have authority to perform this action" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const editVideo = async (req, res) => {
  try {
    const { thumbnail, title, description } = req.body;
    const id = req.params.id;

    if (!thumbnail || !title || !description) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const user = req.user?._id;
    if (user.toString() !== video.owner.toString()) {
      return res.status(401).json({ message: "You don't have authority to perform this action" });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { thumbnail, title, description },
      { new: true }
    );

    return res.status(200).json({ message: "Video updated", updatedVideo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().populate("owner");
    if (!videos) {
      return res.status(401).json({ message: "Sorry no Videos" });
    }
    return res.status(201).json({ videos });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }

}

const findVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate({
      path: "comments",
      populate: {
        path: "user",
        model: "User"
      }
    });
    return res.status(201).json({ video });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const incCount = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);

    if (!video) return res.status(404).json({ message: "Video Not Found" });

    video.views = video.views + 1;
    await video.save();

    const vid = await Video.findById(id)
    return res.status(201).json(vid)

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

const ownerVideo = async (req, res) => {
  try {
    const videos = await Video.find();
    if (!videos) return res.status(404).json({ message: "Sorry no video found" });

    const userId = req.user._id;

    const ownerVideo = videos.filter((video) => userId.toString() === video.owner.toString());
    if (ownerVideo.length == 0) return res.status(404).json({ message: "Please upload videos" });

    return res.status(201).json({ ownerVideo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { uploadVideo, deleteVideo, editVideo, getVideos, findVideo, incCount, ownerVideo };
