import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

import Message from './models/message.js';
import ChatRoom from './models/chat-room.js';


mongoose
  .connect('mongodb+srv://troyanskii1998:qBPchyxPQYOqjVYq@cluster0.ac2ajjj.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB ok!'))
  .catch((err) => console.log('DF error', err));

const app = express();
const server = createServer(app);


app.use(cors());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});


const CHAT_BOT = 'Chat Bot';
let chatRoom = '';
let allUsers = [];


io.on('connection', async (socket) => {
  console.log(`User connected ${socket.id}`);
  const channels = await ChatRoom.find();

  socket.emit('recieve_chats', {
    chats: channels,
  })


  socket.on('join_room', async (data) => {
    if (!channels.find((channel) => channel.chatName === data.room.chatName)) {
      const chatRoom = new ChatRoom({
        chatName: data.room.chatName,
      });
      chatRoom.save();
    }

    socket.join(data.room._id);

    let __createdtime__ = Date.now();

    socket.to(data.room._id).emit('recieve_message', {
      message: `${data.userName} присоединился к комнате`,
      userName: CHAT_BOT,
      __createdtime__,
    });

    socket.emit('recieve_message', {
      message: `Привет ${data.userName}!`,
      userName: CHAT_BOT,
      __createdtime__,
    });

    // chatRoom = data.room.chatName;
    // allUsers.push({id: socket.id, userName, room});
    // let chatRoomUsers = allUsers.filter((user) => user.room === room);
    // socket.to(room).emit('chatroom_users', chatRoomUsers);
    // socket.emit('chatroom_users', chatRoomUsers);
  });

  socket.on('get_last_messages', async (data) => {
    const lastMessages = await Message.find({ chatRoom: data.room });
    console.log(lastMessages)

    socket.emit('recieve_last_messages', lastMessages);
  })

  socket.on('send_message', (data) => {
    console.log(data);
    let __createdtime__ = Date.now();

    const message = new Message({
      message: data.message,
      createdAt: __createdtime__,
      userName: data.userName,
      chatRoom: data.room,
    });
    message.save()
    io.in(data.room._id).emit('recieve_message', data);
  });
});



server.listen(4000, async () => {
  console.log('Server Ok!')
  // try {
  //   await client.connect();
  //   collection = client.db('gamedev').collection('chats');
  //   console.log('Server ok!', server.address().port);
  // } catch (err) {
  //   console.error(err);
  // }
});
