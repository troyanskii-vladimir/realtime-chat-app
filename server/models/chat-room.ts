import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      require: true,
    },
    activeUsers: {
      type: [String],
      require: true,
    },
    messages: {
      type: [String],
      require: true,
    },
  },
);

export default mongoose.model('ChatRoom', ChatRoomSchema);
