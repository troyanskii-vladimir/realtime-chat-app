import { useEffect, useState } from 'react';
import styles from './messages.module.css';
import { Socket } from 'socket.io-client';


type MessagesProps = {
  socket: Socket;
}

type Message = {
  message: string;
  userName: string;
  __createdtime__: string;
}

function Messages({ socket }: MessagesProps): JSX.Element {
  const [messagesRecieved, setMessagesRecieved] = useState<Message[]>([]);


  useEffect(() => {
    socket.on('recieve_message', (data) => {
      console.log(data);
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
    <div className={styles.messagesColumn}>
      {messagesRecieved.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.userName}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimeStamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

export default Messages;
