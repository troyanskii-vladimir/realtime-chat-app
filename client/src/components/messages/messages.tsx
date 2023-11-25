import { useEffect, useState } from 'react';
import './messages.scss';
import { Socket } from 'socket.io-client';


type MessagesProps = {
  socket: Socket;
  userName: string;
}

type Message = {
  message: string;
  userName: string;
  __createdtime__: string;
}

function Messages({ socket, userName }: MessagesProps): JSX.Element {
  const [messagesRecieved, setMessagesRecieved] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('recieve_last_messages', (data) => {
      setMessagesRecieved(data);
    });

    return () => {
      socket.off('recieve_last_messages')
    }

  }, [socket])

  useEffect(() => {
    socket.on('recieve_message', (data) => {
      setMessagesRecieved((state) => [
        ...state,
        {
          message: data.message,
          userName: data.userName,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => {
      socket.off('recieve_message')
    }

  }, [socket])

  function formatDateFromTimeStamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  return (
    <div className="messages">
      {messagesRecieved.map((msg, i) => (
        <div className={`message ${msg.userName === userName ? 'my-message' : ''}`} key={i}>
          <div className="msgMetaContainer">
            <span className="msgUserName">
              {msg.userName}
            </span>
            <span className="msgTime">
              {formatDateFromTimeStamp(msg.__createdtime__)}
            </span>
          </div>
          <p className="msgText">{msg.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Messages;
