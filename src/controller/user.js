const User = require("../model/User");
const ConnectionRequest = require("../model/ConnectionRequest");
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
exports.getUserDetails = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (connectionRequests.length === 0) {
      throw new Error("There is no pending connection request");
    }

    return res.status(200).json({
      message: "User Fetch data Successfully",
      data: connectionRequests,
    });
  } catch (error) {
    return res.status(500).json({
      messgae: error.message,
    });
  }
};

// Friend Fetch
exports.getUserConnection = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const request = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (request.length === 0) {
      throw new Error("User has no friends");
    }

    const data = request.map((value) => {
      if (loggedInUser.equals(value.fromUserId._id)) {
        return value.toUserId;
      } else {
        return value.fromUserId;
      }
    });

    res.status(200).json({
      message: "User Connection Fetch Success!!",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      messgae: error.message,
    });
  }
};

// All User show in Feed except connections
exports.getUserFeed = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const page = parseInt(req.query.page) | 1;
    let limit = parseInt(req.query.limit) | 10;
    limit = limit>50 ? 50 : limit;    // max limit 50
    const skip = (page-1)*limit; 

    // if loggedInUser has any connction with someone than not show that user in my feed
    // all connection requestion send or received not fetch
    const request = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    }).select("fromUserId toUserId");

    // use Set Data Structure for storing users not show in my feed
    const hideUsersFromFeed = new Set();

    request.forEach((value) => {
      hideUsersFromFeed.add(value.fromUserId.toString());
      hideUsersFromFeed.add(value.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    // console.log(hideUsersFromFeed);
    res.status(200).json({
      message: "User Feed Fetch Succesfully!!",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const data = await User.findByIdAndDelete(loggedInUser);
    if (!data) {
      throw new Error("User not found");
    }
    const request = await ConnectionRequest.findOneAndDelete({
      $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
    });
    console.log(request);
    res.status(200).json({
      message: "User Delete Account Succesfully !!",
      data: data,
    });
  } catch (error) {
    res.status(200).json({
      message: "Error in Acount Delete",
      error: message.error,
    });
  }
};
