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
  // const [messagesRecieved, setMessagesRecieved] = useState<Message[]>([]);
  userName = 'vova';
  const [messagesRecieved, setMessagesRecieved] = useState<Message[]>([{
    message: 'Мы любим животных и стараемся поддерживать тех из них, кому не посчастливилось иметь ласковых хозяев и тёплый кров. Один из проверенных способов это сделать — помочь благотворительному фонду «Луч Добра». Благодаря их труду ежегодно сотни питомцев находят свой новый дом',
    userName: 'string',
    __createdtime__: 'string',
  }, {
    message: 'string2',
    userName: 'vova',
    __createdtime__: 'string',
  }, {
    message: 'strin3',
    userName: 'string',
    __createdtime__: 'string',
  }, {
    message: 'Но базовые сценарии поведения пользователей представляют собой не что иное',
    userName: 'string',
    __createdtime__: 'string',
  }, {
    message: 'string',
    userName: 'vova',
    __createdtime__: 'string',
  }, {
    message: 'И нет сомнений, что предприниматели в сети интернет объявлены нарушающими общечеловеческие нормы этики и морали',
    userName: 'vova',
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

  console.log(userName)

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
