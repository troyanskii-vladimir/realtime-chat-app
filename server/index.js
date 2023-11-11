import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

// import Message from './models/message';
// const Message = require('./models/message');
import Message from './models/message.js';


mongoose
  .connect('mongodb+srv://troyanskii1998:qBPchyxPQYOqjVYq@cluster0.ac2ajjj.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('DB ok!'))
  .catch((err) => console.log('DF error', err));

const app = express();
const server = createServer(app);
// const client = new MongoClient('mongodb+srv://troyanskii1998:qBPchyxPQYOqjVYq@cluster0.ac2ajjj.mongodb.net/?retryWrites=true&w=majority');
// mongoose.connect('mongodb+srv://troyanskii1998:qBPchyxPQYOqjVYq@cluster0.ac2ajjj.mongodb.net/?retryWrites=true&w=majority')

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



io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on('join_room', (data) => {
    const {userName, room} = data;
    socket.join(room);

    let __createdtime__ = Date.now();

    console.log(__createdtime__)

    socket.to(room).emit('recieve_message', {
      message: `${userName} присоединился к комнате`,
      userName: CHAT_BOT,
      __createdtime__,
    });

    socket.emit('recieve_message', {
      message: `Привет ${userName}!`,
      userName: CHAT_BOT,
      __createdtime__,
    });

    chatRoom = room;
    allUsers.push({id: socket.id, userName, room});
    let chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);
  });

  socket.on('send_message', (data) => {
    console.log(data);
    let __createdtime__ = Date.now();
    // const { message, userName, room, __createdtime__ } = data;
    // io.in(room).emit('recieve_message', data);
    // // console.log(message, userName, room, __createdtime__)
    // collection.updateOne({ '_id': room }, {
    //   "$push": {
    //     'messages': message
    //   }
    // })
    const message = new Message({
      message: data.message,
      createdAt: __createdtime__,
      userName: data.userName,
    });
    message.save()

  });
});


// express.get("/chats", async (request, response) => {
//   try {
//       let result = await collection.findOne({ "_id": request.query.room });
//       response.send(result);
//   } catch (e) {
//       response.status(500).send({ message: e.message });
//   }
// });


server.listen(4000, async () => {
  console.timeLog('Server Ok!')
  // try {
  //   await client.connect();
  //   collection = client.db('gamedev').collection('chats');
  //   console.log('Server ok!', server.address().port);
  // } catch (err) {
  //   console.error(err);
  // }
});
