import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      require: true,
    },
    createdAt: {
      type: String,
      require: true,
    },
    userName: {
      type: String,
      require: true,
    },
    chatRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    }
  },
);

export default mongoose.model('Message', MessageSchema);
