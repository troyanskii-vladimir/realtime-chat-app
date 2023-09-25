import styles from './chat.module.css';
import Messages from '../../components/messages/messages';
import { Socket } from 'socket.io-client';


type ChatPageProps = {
  userName: string;
  room: string;
  socket: Socket;
}

function ChatPage({ userName, room, socket }: ChatPageProps): JSX.Element {
  return (
    <div className={styles.chatContainer}>
      <div>
        <Messages socket={socket} />
      </div>
    </div>
  );
}

export default ChatPage;
