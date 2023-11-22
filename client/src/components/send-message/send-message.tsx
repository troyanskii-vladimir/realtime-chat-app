import { Socket } from 'socket.io-client';
import './send-message.scss';
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
    <div className="send_message">
      <input
        className="messageInput"
        placeholder='Текст сообщения'
        onChange={(evt) => setMessage(evt.target.value)}
        value={message}
      />
      <button className='btn btn-send' onClick={sendMessage}>
        Send Message
      </button>
      {/* <button className='btn btn-primary' onClick={() => {
        socket.emit('get_last_messages', room)
      }}>
        Загрузить последние сообщения
      </button> */}
    </div>
  );
}

export default SendMessage;
