import './users.scss';
import { Socket } from 'socket.io-client';


type UsersProps = {
  socket: Socket;
  users: string[];
  onlineUsers: string[];
  roomName: string | undefined;
}

function Users({users, onlineUsers}: UsersProps): JSX.Element {
  const offlineUsers = [...users].filter((user) => !onlineUsers.includes(user));

  return (
    <>
      <h3 className="users__title">Список участников</h3>
      <ul className="users_list online_list">
        {
          onlineUsers?.map((user) => (
            <li className="user__name" key={`${user}-online`}>
              {user}
            </li>
          ))
        }
      </ul>
      <ul className="users_list offline_list">
        {
          offlineUsers?.map((user) => (
            <li className="user__name" key={`${user}-offline`}>
              {user}
            </li>
          ))
        }
      </ul>
    </>
  );
}

export default Users;
