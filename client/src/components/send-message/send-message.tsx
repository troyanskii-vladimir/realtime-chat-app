import { Socket } from 'socket.io-client';
import styles from './send.module.css';
import { useState } from 'react';
import { Chat } from '../../pages/home-page/home-page';


type SendMessageProps = {
  userName: string;
  room: Chat | null;
  socket: Socket;
}

function SendMessage({ userName, room, socket }: SendMessageProps): JSX.Element {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (message !== '') {
      const __createdtime__ = Date.now();
      socket.emit('send_message', {userName, room, message, __createdtime__});
      setMessage('');
    }
  };

  return (
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder='Message...'
        onChange={(evt) => setMessage(evt.target.value)}
        value={message}
      />
      <button className='btn btn-primary' onClick={sendMessage}>
        Send Message
      </button>
      <button className='btn btn-primary' onClick={() => {
        socket.emit('get_last_messages', room)
      }}>
        Загрузить последние сообщения
      </button>
    </div>
  );
}

export default SendMessage;
