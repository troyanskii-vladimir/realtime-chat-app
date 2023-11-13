import { SetStateAction, useEffect, useState } from 'react';
import { Dispatch } from 'react';
import styles from './home.module.css';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';


type HomePageProps = {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  room: Chat | null;
  setRoom: Dispatch<SetStateAction<Chat | null>>;
  socket: Socket;
}

export type Chat = {
  _id: string;
  chatName: string,
}

function HomePage({userName, setUserName, room, setRoom, socket}: HomePageProps): JSX.Element {
  const navigate = useNavigate();
  const [chats, setChats] = useState<Chat[]>([]);
  const [creatingShow, setCreatingShow] = useState<boolean>(false);
  const [newChatName, setNewChatName] = useState<string>('');

  useEffect(() => {
    socket.on('recieve_chats', (data) => {
      setChats(data.chats)
    })

    return () => {
      socket.off('recieve_message')
    }
  }, [socket])

  const joinRoom = () => {
    if (room !== null && userName !== '') {
      socket.emit('join_room', {userName, room});

      navigate('/chat', {replace: true});
    }
  };


  return (
    <div className={styles.container}>

      <div className={styles.textContainer}>
        <h2 className={styles.mainTitle}>Chat app</h2>
        <h3 className={styles.description}>Чат приложение для обмена сообщениями между пользователями в реальном времени с возможностью выбора комнаты</h3>
        <button className={styles.btn} onClick={joinRoom}>Войти в чат</button>
      </div>


      <div className={styles.formContainer}>
        <input
          className={styles.input}
          placeholder='Username...'
          onChange={(evt) => {
            setUserName(evt.target.value);
          }}
        />
        <ul className={styles.chatList}>
          {
            true &&
            [{chatName: 'Test1', _id: 1}, {chatName: 'yest23', _id: 2}].map((chat) => {
              return (
                <div className={styles.form_radio_btn} key={chat._id}>
                  <input id={`radio-${chat._id}`} type="radio" name="radio" value={chat.chatName} onChange={() => {
                    setCreatingShow(false);
                    setRoom(chat);
                  }} />
                  <label htmlFor={`radio-${chat._id}`}>{chat.chatName}</label>
                </div>
              );
            })
          }
          <li className={styles.form_radio_btn_new}>
            <input id="radio-new" name="radio" type="radio" onChange={(evt) => {
              setCreatingShow(evt.target.value);
            }} />
            {
              !creatingShow &&
              <label htmlFor="radio-new">
                Создать новый чат
              </label>
            }
            {
              creatingShow &&
              <div htmlFor="radio-new" className={styles.creating_container}>
                <input placeholder="Введите название чата" type="text" value={newChatName} onChange={(evt) => setNewChatName(evt.target.value)} />
                <button onClick={(evt) => {
                  console.log(newChatName)
                  socket.emit('create_room', {chatName: newChatName});
                  setNewChatName('');
                }}>Создать чат</button>
              </div>
            }
          </li>
        </ul>
      </div>

    </div>
  );
}

export default HomePage;
