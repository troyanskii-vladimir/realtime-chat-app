import './users.scss';


type UsersProps = {
  users: string[];
  onlineUsers: string[];
}

function Users({users, onlineUsers}: UsersProps): JSX.Element {
  return (
    <div className="users online_lis">
      <h3 className="users__title">Список участников</h3>
      <ul className="users_list">
        {
          onlineUsers?.map((user) => (
            <li className="user__name">
              {user}
            </li>
          ))
        }
      </ul>
      <ul className="users_listt">
        {
          users?.map((user) => (
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
