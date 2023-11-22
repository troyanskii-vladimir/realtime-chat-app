import './users.scss';


type UsersProps = {
  users: string[];
  onlineUsers: string[];
}

function Users({users, onlineUsers}: UsersProps): JSX.Element {
  const offlineUsers = [...users].filter((user) => !onlineUsers.includes(user));

  return (
    <div className="users">
      <h3 className="users__title">Список участников</h3>
      <ul className="users_list online_list">
        {
          onlineUsers?.map((user) => (
            <li className="user__name">
              {user}
            </li>
          ))
        }
      </ul>
      <ul className="users_list">
        {
          offlineUsers?.map((user) => (
            <li className="user__name">
              {user}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default Users;
