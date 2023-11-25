import './chat-page.scss';
import Messages from '../../components/messages/messages';
import { Socket } from 'socket.io-client';
import SendMessage from '../../components/send-message/send-message';
import { Chat } from '../home-page/home-page';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SendMessageGuest from '../../components/send-message/send-message-guest';
import RoomInfo from '../../components/room-info/room-info';


type ChatPageProps = {
  userName: string;
  room: Chat | null;
  socket: Socket;
}

function ChatPage({ userName, room, socket }: ChatPageProps): JSX.Element {
  const [users, setUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const chatRoomName = useParams().id;

  const joinRoom = () => {
    if (userName !== '') {
      socket.emit('join_room', {userName, room});
    } else {
      socket.emit('join_room_guest', {chatRoomName});
    }
  };

  useEffect(() => {
    socket.on('recieve_room_data', (data) => {
      setUsers(data.users);
      setOnlineUsers(data.onlineUsers);
    });

    return () => {
      socket.off('recieve_room_data')
    }

  }, [socket])

  useEffect(() => {
    setTimeout(joinRoom, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomName])


  return (
    <div className="chatContainer">
        <RoomInfo socket={socket} userName={userName} users={users} onlineUsers={onlineUsers} roomName={chatRoomName} />
        <Messages socket={socket} userName={userName} />
        {
          userName &&
          <SendMessage socket={socket} userName={userName} room={room} />
        }
        {
          !userName &&
          <SendMessageGuest />
        }
    </div>
  );
}

export default ChatPage;
