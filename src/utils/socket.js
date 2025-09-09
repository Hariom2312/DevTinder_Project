// const socket = require("socket.io");

// const initiliseSocket = (server) => {
//     const io = socket(server, {
//         cors: ({
//             origin: "http://localhost:5173",
//             credentials: true,
//         })
//     });

//     io.on("connection", (socket) => {
//         //   console.log("Socket ID:",socket.id);

//         // joinChat Event
//         socket.on("joinChat", ({ userId, targetUserID }) => {
//             const roomId = [userId, targetUserID].sort().join("_");
//             socket.join(roomId);
//             console.log("Room Id", roomId);
//         })

//         // sendMessage Event
//         socket.on("sendMessage", ({ firstName, userId, targetUserID, text }) => {
//             const roomId = [userId, targetUserID].sort().join("_");
//             console.log(firstName, "send ", text);
//             io.to(roomId).emit("messageReceived", { firstName, text });
//         });

//         // disconnect Event
//         //   socket.close("disconnect");
//     })

//     io.close();
// }

// module.exports = initiliseSocket;




const socket = require("socket.io");
const Message = require("../model/Message.js"); // make sure you import your Mongoose model

const initiliseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // joinChat Event
    socket.on("joinChat", ({ userId, targetUserID }) => {
      const roomId = [userId, targetUserID].sort().join("_");
      socket.join(roomId);
      console.log("📌 User", userId, "joined room", roomId);
    });

    // sendMessage Event
    socket.on("sendMessage", async({ firstName, userId, targetUserID, text }) => {
      const roomId = [userId, targetUserID].sort().join("_");
    //   console.log(firstName,userId, "send",targetUserID, text);

      try {
        // Save to MongoDB
        const newMessage = new Message({
          senderId: userId,
          receiverId: targetUserID,
          text,
        });
        await newMessage.save();

        // Emit saved message with IDs and timestamps
        io.to(roomId).emit("messageReceived", {
          _id: newMessage._id,
          senderId: userId,
          receiverId: targetUserID,
          text,
          firstName,
          createdAt: newMessage.createdAt,
          seenAt: newMessage.seenAt || null,
        });
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

    // markAsSeen Event
    socket.on("markAsSeen", async ({ messageId, userId }) => {
      try {
        const msg = await Message.findById(messageId);
        if (msg && !msg.seenAt && msg.receiverId.toString() === userId) {
          msg.seenAt = new Date();
          await msg.save();

          const roomId = [msg.senderId, msg.receiverId].sort().join("_");
          io.to(roomId).emit("messageSeen", {
            messageId: msg._id,
            seenAt: msg.seenAt,
          });

        //   console.log("👁️ Message", msg._id, "seen at", msg.seenAt);
        }
      } catch (error) {
        console.error("❌ Error marking message as seen:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};

module.exports = initiliseSocket;
