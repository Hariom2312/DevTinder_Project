const ConnectionRequest = require("../model/ConnectionRequest");
const User = require("../model/User");

exports.sendConnectionRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    if (fromUserId.equals(toUserId)) {
      throw new Error("You can't send request yourself");
    }

    const AllowedStatus = ["interested", "ignored"];
    if (!AllowedStatus.includes(status)) {
      return res.status(401).json({ message: "Status not Valid" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnection) {
      return res
        .status(401)
        .json({ message: "Error Connection Already Exists..." });
    }

    const user = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      status,
    });
    console.log("user", user);

    res.status(200).json({
      message:`${req.user.firstName} Send Connection Request to ${toUser.firstName} Successfully`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error in send connectionRequest ",
      error: error.message,
    });
  }
};


exports.reviewConnectionRequest = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const { status, requestId } = req.params;

    const AllowedStatus = ["accepted", "rejected"];
    if (!AllowedStatus.includes(status)) {
      return res.status(401).json({ message: "Status not Valid" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser,
      status: "interested",
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection Request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    // accept request means friend and chat
    // if (status == "rejected") {
    //   // rejected means delete connection from DB
    //   const request = await ConnectionRequest.findByIdAndDelete(
    //     { _id: requestId }
    //   );
    //   console.log("request id rejected", request);
    // }

    return res
      .status(200)
      .json({ message: `User ${status} your request`, data: data });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error in review connectionRequest",
        error: error.message,
        error,
      });
  }
};
