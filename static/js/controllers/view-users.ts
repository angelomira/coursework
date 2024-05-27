export { }

interface User {
    id: number;
    name_forename: string;
    name_cognomen: string;
    name_patronim: string;
    email: string;
    phone: string;
    id_role: number;
    passp: string;
    login: string;
}

document.addEventListener('DOMContentLoaded', async function() {
    const BASE_URL = 'http://localhost:3000/';

    const PARAMS_SEARCH = document.getElementById('params.search') as HTMLInputElement;
    const PARAMS_FILTER = document.getElementById('params.filter') as HTMLSelectElement;

    const TABLES = document.getElementById('database')!
                           .getElementsByTagName('tbody')[0] as HTMLTableSectionElement;

    var _users: User[];

    parse();

    function parse(): void {
        fetch(BASE_URL + 'api/users')
            .then(response => response.json())
            .then((users: User[]) => {
                usertable(users);

                _users = users;
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    function usertable(users: User[]): void {
        TABLES.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
        
            const ID_CELL = document.createElement('td');
            ID_CELL.textContent = user.id.toString();
            row.appendChild(ID_CELL);
        
            const FORENAME_CELL = document.createElement('td');
            FORENAME_CELL.textContent = user.name_forename;
            row.appendChild(FORENAME_CELL);
            const COGNOMEN_CELL = document.createElement('td');
            COGNOMEN_CELL.textContent = user.name_cognomen;
            row.appendChild(COGNOMEN_CELL);
            const PATRONIM_CELL = document.createElement('td');
            PATRONIM_CELL.textContent = user.name_patronim;
            row.appendChild(PATRONIM_CELL);

            const EMAIL_CELL = document.createElement('td');
            EMAIL_CELL.textContent = user.email;
            row.appendChild(EMAIL_CELL);
            const PHONE_CELL = document.createElement('td');
            PHONE_CELL.textContent = user.phone;
            row.appendChild(PHONE_CELL);

            const PASSP_CELL = document.createElement('td');
            PASSP_CELL.textContent = user.passp;
            row.appendChild(PASSP_CELL);
            const LOGIN_CELL = document.createElement('td');
            LOGIN_CELL.textContent = user.login;
            row.appendChild(LOGIN_CELL);

            const ACTIONS = document.createElement('td');

            const EDIT_BUTTON = document.createElement('button');
            EDIT_BUTTON.textContent = '...';
            EDIT_BUTTON.addEventListener('click', () => reroute(user.id));

            ACTIONS.appendChild(EDIT_BUTTON);
        
            row.appendChild(ACTIONS);
        
            TABLES.appendChild(row);
        });
    }

    PARAMS_SEARCH.addEventListener('input', () => {
        const SEARCH = PARAMS_SEARCH.value.toLowerCase();
        const FILTER = PARAMS_FILTER.value.toLowerCase();
        const FILTER_USERS = _users.filter(user => {
            switch(FILTER) {
                case 'forename':
                    return user.name_forename.toLowerCase().includes(SEARCH);
                case 'cognomen':
                    return user.name_cognomen.toLowerCase().includes(SEARCH);
                case 'patronim':
                    return user.name_patronim.toLowerCase().includes(SEARCH);
                case 'email':
                    return user.email.toLowerCase().includes(SEARCH);
                case 'phone':
                    return user.phone.toLowerCase().includes(SEARCH);
                case 'passp':
                    return user.passp.toLowerCase().includes(SEARCH);
                case 'login':
                    return user.login.toLowerCase().includes(SEARCH);
                default:
                    return (
                        user.name_forename.toLowerCase().includes(SEARCH) ||
                        user.name_cognomen.toLowerCase().includes(SEARCH) ||
                        (user.name_patronim && 
                         user.name_patronim.toLowerCase().includes(SEARCH)) ||
                        (user.email && 
                         user.email.toLowerCase().includes(SEARCH)) ||
                        (user.phone &&
                         user.phone.toLowerCase().includes(SEARCH)) ||
                        user.passp.toLowerCase().includes(SEARCH) ||
                        user.login.toLowerCase().includes(SEARCH)
                    );
            }
        });

        usertable(FILTER_USERS);
    });

    function reroute(user_id: number): void {
        const userq = _users.find(user => user.id === user_id);

        localStorage.setItem('userq', JSON.stringify(userq));

        window.location.href= `accounts/account.html`;
    }
});
