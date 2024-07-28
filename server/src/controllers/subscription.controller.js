import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/userModel.js";

const subscribe = async (req, res) => {
  try {
    const channelId = req.params.id;
    const userId = req?.user?._id;

    const channel = await User.findById(channelId);
    if (!channel || !channel.isCreater) {
      return res.status(404).json({ message: "Channel not found" });
    }

    let user = await User.findById(userId);

    const existingSubscription = await Subscription.findOne({
      channel: channelId,
      subscriber: userId,
    });

    if (existingSubscription) {
      await user.subscriptions.pull(existingSubscription._id);
      await user.save();
      await Subscription.findByIdAndDelete(existingSubscription._id);
      user = await User.findById(userId).select("-password -refreshToken");
      user = await user.populate("subscriptions");
      return res.status(201).json({ message: "Unfollowed", user });
    }

    const newSubscription = await Subscription.create({
      subscriber: userId,
      channel: channelId,
    });

    user.subscriptions.push(newSubscription._id);
    await user.save();

    user = await User.findById(userId).select("-password -refreshToken");
    user = await user.populate("subscriptions");
    return res.status(201).json({ message: "Following", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const getSubscribers = async (req, res) => {
  try {
    const userId = req?.user?._id;
    let subscribers = await Subscription.find({ channel: userId }).populate("subscriber");

    if (subscribers.length === 0) {
      return res.status(201).json({ message: "No subscribers", subscribers });
    }

    subscribers = subscribers.map(sub => sub.subscriber);

    return res.status(200).json({ subscribers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export { subscribe, getSubscribers };
