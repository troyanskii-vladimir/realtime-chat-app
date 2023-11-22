import { useEffect, useState } from 'react';
import './messages.scss';
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
  // const [messagesRecieved, setMessagesRecieved] = useState<Message[]>([]);
  const [messagesRecieved, setMessagesRecieved] = useState<Message[]>([{
    message: 'string',
    userName: 'string',
    __createdtime__: 'string',
  }, {
    message: 'string',
    userName: 'string',
    __createdtime__: 'string',
  }]);

  // useEffect(() => {
  //   socket.on('recieve_last_messages', (data) => {
  //     setMessagesRecieved(data);
  //   });

  //   return () => {
  //     socket.off('recieve_last_messages')
  //   }

  // }, [socket])

  // useEffect(() => {
  //   socket.on('recieve_message', (data) => {
  //     setMessagesRecieved((state) => [
  //       ...state,
  //       {
  //         message: data.message,
  //         userName: data.userName,
  //         __createdtime__: data.__createdtime__,
  //       },
  //     ]);
  //   });

  //   return () => {
  //     socket.off('recieve_message')
  //   }

  // }, [socket])


  function formatDateFromTimeStamp(timestamp: string) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  }

  return (
    <div className="messages">
      {messagesRecieved.map((msg, i) => (
        <div className="message" key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="msgMeta">{msg.userName}</span>
            <span className="msgMeta">
              {formatDateFromTimeStamp(msg.__createdtime__)}
            </span>
          </div>
          <p className="msgText">{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
}

export default Messages;
