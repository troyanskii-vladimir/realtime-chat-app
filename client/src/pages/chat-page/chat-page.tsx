import './chat-page.scss';
import Messages from '../../components/messages/messages';
import { Socket } from 'socket.io-client';
import SendMessage from '../../components/send-message/send-message';
import { Chat } from '../home-page/home-page';
import Users from '../../components/users/users';


type ChatPageProps = {
  userName: string;
  room: Chat | null;
  socket: Socket;
}

function ChatPage({ userName, room, socket }: ChatPageProps): JSX.Element {
  return (
    <div className="chatContainer">
        <Users />
        <Messages socket={socket} />
        <SendMessage socket={socket} userName={userName} room={room} />
    </div>
  );
}

export default ChatPage;
