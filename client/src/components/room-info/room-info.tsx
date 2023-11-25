import { Socket } from 'socket.io-client';
import Users from '../users/users';
import './room-info.scss'
import { useNavigate } from 'react-router-dom';


type RoomInfoProps = {
  socket: Socket;
  userName: string;
  users: string[];
  onlineUsers: string[];
  roomName: string | undefined;
}

function RoomInfo({socket, users, userName, onlineUsers, roomName}: RoomInfoProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="room__info">
        <ul className="info__list">
          <li className="info__item">
            <button
              className="btn btn__back"
              onClick={() => {
                socket.emit('disc')
                navigate('/');
              }}
            >
              Вернуться к выбору чата
            </button>
          </li>
          <li className="info__item">
            <h3 className="room__title">{roomName}</h3>
            <p className="room__describe">Название комнаты</p>
          </li>
          <li className="info__item">
            <h3 className="room__title">{userName ? userName : 'Гость'}</h3>
            <p className="room__describe">Пользователь</p>
          </li>
          <li className='users'>
            <Users socket={socket} users={users} onlineUsers={onlineUsers} roomName={roomName}/>
          </li>
        </ul>
    </div>
  );
}

export default RoomInfo;
