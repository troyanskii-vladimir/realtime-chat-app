import styles from './chat.module.css';
import Messages from '../../components/messages/messages';
import { Socket } from 'socket.io-client';
import SendMessage from '../../components/send-message/send-message';
import { Chat } from '../home-page/home-page';


type ChatPageProps = {
  userName: string;
  room: Chat | null;
  socket: Socket;
}

function ChatPage({ userName, room, socket }: ChatPageProps): JSX.Element {
  return (
    <div className={styles.chatContainer}>
      <div>
        <Messages socket={socket} />
        <SendMessage socket={socket} userName={userName} room={room} />
      </div>
    </div>
  );
}

export default ChatPage;
