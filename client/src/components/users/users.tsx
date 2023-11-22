import './users.scss';

function Users(): JSX.Element {
    return (
        <div className="users">
            <h3 className="users__title">Список участников</h3>
            <ul className="users_list">
                <li className="user__name">
                    Пользователь1
                </li>
                <li>
                    Пользователь2
                </li>
                <li>
                    Пользователь3
                </li>
                <li>
                    Пользователь4
                </li>
            </ul>
        </div>
    );
}

export default Users;
