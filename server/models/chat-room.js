import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      require: true,
      unique: true,
    },
    users: {
      type: Array,
      default: [],
    },
    onlineUsers: {
      type: Array,
      default: [],
    }
  },
);

export default mongoose.model('ChatRoom', ChatRoomSchema);
