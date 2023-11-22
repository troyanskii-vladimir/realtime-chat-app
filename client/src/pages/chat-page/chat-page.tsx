import './chat-page.scss';
import Messages from '../../components/messages/messages';
import { Socket } from 'socket.io-client';
import SendMessage from '../../components/send-message/send-message';
import { Chat } from '../home-page/home-page';
import Users from '../../components/users/users';
import { useEffect, useState } from 'react';


type ChatPageProps = {
  userName: string;
  room: Chat | null;
  socket: Socket;
}

function ChatPage({ userName, room, socket }: ChatPageProps): JSX.Element {
  const [users, setUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);


  useEffect(() => {
    socket.on('recieve_room_data', (data) => {
      setUsers(data.users);
      setOnlineUsers(data.onlineUsers);
    });

    return () => {
      socket.off('recieve_room_data')
    }

  }, [socket])


  return (
    <div className="chatContainer">
        <Users users={users} onlineUsers={onlineUsers} />
        <Messages socket={socket} userName={userName} />
        <SendMessage socket={socket} userName={userName} room={room} />
    </div>
  );
}

export default ChatPage;
