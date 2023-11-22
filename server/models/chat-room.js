import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      require: true,
      unique: true,
    },
  },
);

export default mongoose.model('ChatRoom', ChatRoomSchema);
