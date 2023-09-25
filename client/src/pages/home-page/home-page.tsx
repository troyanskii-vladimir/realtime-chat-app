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
    if (room !== '' && userName !== '') {
      socket.emit('join_room', {userName, room});

      navigate('/chat', {replace: true});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2>{`<>DevRooms</>`}</h2>
        <input
          className={styles.input}
          placeholder='Username...'
          onChange={(evt) => {
            setUserName(evt.target.value);
          }}
        />

        <select
          className={styles.input}
          onChange={(evt) => {
            setRoom(evt.target.value);
          }}
        >
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>

        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

export default HomePage;
