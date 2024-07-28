import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/videoModel.js";
import { transporter } from "../utils/nodemailerTransport.js";

const registerUser = async (req, res) => {
  try {
    const { userName, email, password, fullName, avatar, isCreater } = req.body;
    if ([userName, email, password, fullName, avatar, isCreater].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existedUser = await User.findOne({ userName });

    if (existedUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    const avlp = req.files?.avatar?.[0]?.path;
    const cvimg = req.files?.coverImage?.[0]?.path || "";

    if (!avlp) {
      return res.status(400).json({
        message: "Upload avatar"
      });
    }

    const avatarCloud = await uploadOnCloudinary(avlp);
    const coverImage = cvimg ? await uploadOnCloudinary(cvimg) : null;

    if (!avatarCloud) {
      return res.status(400).json({
        message: "Avatar upload failed"
      });
    }

    const user = await User.create({
      fullName,
      userName: userName.toLowerCase(),
      email,
      password,
      avatar: avatarCloud.url,
      coverImage: coverImage?.url || "",
      isCreater
    });

    if (!user) {
      return res.status(500).json({
        message: "Can not create user"
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New Registration',
      html: `<h1>New Registration</h1><p>Hi, Mr./Ms. "${userName}" thank you for registering on our website. To continue, please <a href="http://localhost:5173/login">login</a>.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    return res.status(201).json({
      message: "User created successfully",
      userInfo: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validityBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    return "error while generating tokens";
  }

}


const loginUser = async (req, res) => {
  let { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({
      message: "fill mandatory fields"
    })
  }

  const user = await User.findOne({ userName }).populate("subscriptions");

  if (!user) {
    return res.status(404).json("user not found");
  }

  let validPass = await user.isPasswordCorrect(password);

  if (!validPass) {
    return res.status(400).json("invalid username or password");
  }

  const { accessToken, refreshToken } = await generateToken(user._id);

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
    message: "user loggedIn successfully",
    user
  });

}


const logoutUser = async (req, res) => {

  await User.findByIdAndUpdate(req.user._id,
    {
      $set: {
        refreshToken: null
      }
    },
    {
      new: true
    }
  );
  const options = {
    httpOnly: true,
    secure: true
  }
  res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
    message: "user logged out suuccesfully",
    user: req.user
  })
}

const addWatchHistory = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const videoIndex = user.watchHistory.findIndex((item) => item.toString() === video._id.toString());

  if (videoIndex !== -1) {
    user.watchHistory.splice(videoIndex, 1);
  }
  user.watchHistory.unshift(video._id);

  await user.save();
  return res.status(201).json({ message: "Added to watch history" });
};

const getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'watchHistory',
        populate: {
          path: 'owner',
          model: 'User'
        }
      });

    const watchHistory = user.watchHistory;
    return res.status(200).json({ watchHistory });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error });
  }
}


export { registerUser, loginUser, logoutUser, addWatchHistory, getWatchHistory }