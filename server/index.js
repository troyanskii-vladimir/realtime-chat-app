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


// const CHAT_BOT = 'Chat Bot';
// let chatRoom = '';
let allUsers = [];
let allOnlineUsers = [];

// type User = {
//   chatName: String,
//   name: String,
// }


io.on('connection', async (socket) => {
  console.log(`User connected ${socket.id}`);
  let baseUserName = '';
  let baseChatName = '';
  let baseChatId = ''

  const channels = await ChatRoom.find();

  socket.emit('recieve_chats', {
    chats: channels,
  });

  socket.on('create_room', async (data) => {
    const chatRoom = new ChatRoom({
      chatName: data.chatName,
    });

    chatRoom.save();
  });

  socket.on('join_room', async (data) => {
    baseUserName = data.userName;
    baseChatName = data.room.chatName;
    baseChatId = data.room._id;

    console.log(baseUserName, baseChatName)

    const lastMessages = await Message.find({ chatRoom: data.room });

    const usersInRoom = [...allUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const usersNamesInRoom = usersInRoom.map((dataUsers) => dataUsers.name) || [];

    allOnlineUsers.push({
      name: baseUserName,
      chatName: baseChatName,
    })
    if (!usersNamesInRoom.includes(baseUserName)) {
      allUsers.push({
        name: baseUserName,
        chatName: baseChatName,
      })
    }

    const actualUsersInRoom = [...allUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const onlineUsersInRoom = [...allOnlineUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const users = actualUsersInRoom.map((allUsersData) => allUsersData.name);
    const onlineUsers = onlineUsersInRoom.map((allUsersData) => allUsersData.name);

    socket.join(data.room._id);
    io.in(data.room._id).emit('recieve_room_data', {users, onlineUsers})
    socket.emit('recieve_last_messages', lastMessages);
  });

  socket.on('get_last_messages', async (data) => {
    const lastMessages = await Message.find({ chatRoom: data.room });

    socket.emit('recieve_last_messages', lastMessages);
  })

  socket.on('send_message', (data) => {
    let __createdtime__ = Date.now();

    console.log(allUsers)

    const message = new Message({
      message: data.message,
      createdAt: __createdtime__,
      userName: data.userName,
      chatRoom: data.room,
    });
    message.save()
    io.in(data.room._id).emit('recieve_message', data);
  });

  socket.on('disconnecting', () => {
    console.log('Userd disconnect', baseUserName);
    allOnlineUsers = [...allOnlineUsers].filter((dataUsers) => dataUsers.name !== baseUserName);

    const actualUsersInRoom = [...allUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const onlineUsersInRoom = [...allOnlineUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const users = actualUsersInRoom.map((allUsersData) => allUsersData.name);
    const onlineUsers = onlineUsersInRoom.map((allUsersData) => allUsersData.name);

    io.in(baseChatId).emit('recieve_room_data', {users, onlineUsers})
  })
});


server.listen(4000, async () => {
  console.log('Server Ok!')
});
