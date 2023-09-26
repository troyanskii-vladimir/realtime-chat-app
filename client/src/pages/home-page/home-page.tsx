import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import styles from './home.module.css';
import { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';


type HomePageProps = {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  room: string;
  setRoom: Dispatch<SetStateAction<string>>;
  socket: Socket;
}

function HomePage({userName, setUserName, room, setRoom, socket}: HomePageProps): JSX.Element {
  const navigate = useNavigate();

  const joinRoom = () => {
    console.log({userName, room});
    if (room !== '' && userName !== '') {
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
          ['javascript', 'node', 'react', 'express'].map((obj, index) => {
            return (
              <div className={styles.form_radio_btn}>
                <input id={`radio-${index}`} type="radio" name="radio" value={obj} onChange={(evt) => {
                  setRoom(evt.target.value);
                }} />
                <label htmlFor={`radio-${index}`}>{obj}</label>
              </div>
            );
          })
        }
        </ul>



      </div>

    </div>
  );
}

export default HomePage;
