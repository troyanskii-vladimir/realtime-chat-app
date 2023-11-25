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
    origin: 'https://realtime-chat-app-livid-kappa.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// const CHAT_BOT = 'Chat Bot';
// let chatRoom = '';
let allUsers = [];
let allOnlineUsers = [];


io.on('connection', async (socket) => {
  console.log(`User connected ${socket.id}`);
  let baseUserName = '';
  let baseChatName = '';
  let baseChatId = ''
  let channels = await ChatRoom.find();

  socket.emit('recieve_chats', {
    chats: channels,
  });

  socket.emit('recieve_online_users', {
    onlineUsers: allOnlineUsers.map((user) => user.name),
  })

  socket.on('get_chats_data', () => {
    socket.emit('recieve_chats', {
      chats: channels,
    });
    socket.emit('recieve_online_users', {
      onlineUsers: allOnlineUsers.map((user) => user.name),
    })
  })

  socket.on('create_room', async (data) => {
    const chatRoom = new ChatRoom({
      chatName: data.chatName,
    });

    chatRoom.save();

    channels.push(chatRoom);

    io.emit('recieve_chats', {
      chats: channels,
    });
  });

  socket.on('join_room', async (data) => {
    baseUserName = data.userName;
    baseChatName = data.room.chatName;
    baseChatId = data.room._id;

    const lastMessages = await Message.find({ chatRoom: data.room });

    allOnlineUsers.filter((userData) => userData.name !== baseUserName);

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

  socket.on('join_room_guest', async (data) => {
    baseUserName = 'Guest';

    const room = await ChatRoom.find({ chatName: data.chatRoomName })

    baseChatName = room.chatName;
    baseChatId = room._id;

    console.log(baseChatId)

    const lastMessages = await Message.find({ chatRoom: room });

    const actualUsersInRoom = [...allUsers].filter((dataUsers) => dataUsers.chatName === data.chatRoomName) || [];
    const onlineUsersInRoom = [...allOnlineUsers].filter((dataUsers) => dataUsers.chatName === data.chatRoomName) || [];
    const users = actualUsersInRoom.map((allUsersData) => allUsersData.name);
    const onlineUsers = onlineUsersInRoom.map((allUsersData) => allUsersData.name);

    socket.join(baseChatId);
    io.in(baseChatId).emit('recieve_room_data', {users, onlineUsers})
    socket.emit('recieve_last_messages', lastMessages);
  })

  socket.on('get_last_messages', async (data) => {
    const lastMessages = await Message.find({ chatRoom: data.room });

    socket.emit('recieve_last_messages', lastMessages);
  })

  socket.on('send_message', (data) => {
    let __createdtime__ = Date.now();

    const message = new Message({
      message: data.message,
      createdAt: __createdtime__,
      userName: baseUserName,
      chatRoom: baseChatId, //нужно передать объект команты
    });
    message.save()
    io.in(baseChatId).emit('recieve_message', data);
  });

  socket.on('disc', () => {
    console.log('Userd disconnec', baseUserName);
    allOnlineUsers = [...allOnlineUsers].filter((dataUsers) => dataUsers.name !== baseUserName);

    const actualUsersInRoom = [...allUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const onlineUsersInRoom = [...allOnlineUsers].filter((dataUsers) => dataUsers.chatName === baseChatName) || [];
    const users = actualUsersInRoom.map((allUsersData) => allUsersData.name);
    const onlineUsers = onlineUsersInRoom.map((allUsersData) => allUsersData.name);

    io.in(baseChatId).emit('recieve_room_data', {users, onlineUsers})
  })

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
