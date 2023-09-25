import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'node:http';

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


io.on('connection', (socket) => {
	console.log(`User connected ${socket.id}`);

	socket.on('join_room', (data) => {
		const {userName, room} = data;
		socket.join(room);

		let __createdtime__ = Date.now();

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
});



server.listen(4000, () => 'Server Ok');
