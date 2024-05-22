document.addEventListener('DOMContentLoaded', async function() {
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const userTable = document.getElementById('userTable').getElementsByTagName('tbody')[0];

    var _users;

    // Fetch users data from API
    fetchUsers();

    // Function to fetch users data from API
    function fetchUsers() {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                // Populate user table with fetched data
                populateUserTable(users);

                _users = users;
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    // Function to populate user table
    function populateUserTable(users) {
        // Clear existing table rows
        userTable.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
        
            const userIdCell = document.createElement('td');
            userIdCell.textContent = user.id;
            row.appendChild(userIdCell);
        
            const firstNameCell = document.createElement('td');
            firstNameCell.textContent = user.name_forename;
            row.appendChild(firstNameCell);
        
            const lastNameCell = document.createElement('td');
            lastNameCell.textContent = user.name_cognomen;
            row.appendChild(lastNameCell);
        
            const actionCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editUser(user.id));
            actionCell.appendChild(editButton);
        
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteUser(user.id));
            actionCell.appendChild(deleteButton);
        
            row.appendChild(actionCell);
        
            userTable.appendChild(row);
        });
    }

    // Function to search users
    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        const filteredUsers = _users.filter(_users => 
            _users.user_firstname.toLowerCase().includes(searchText) ||
            _users.user_lastname.toLowerCase().includes(searchText)
        );
        populateUserTable(filteredUsers);
    });

    // Function to filter users
    filterSelect.addEventListener('change', function() {
        const filterValue = this.value;
        // Implement filtering logic based on selected filter value
    });

    // Function to edit user profile
    function editUser(userId) {
        // Redirect to edit user profile page with userId parameter
        window.location.href = `/edit-user/${userId}`;
    }

    // Function to delete user
    function deleteUser(userId) {
        // Implement delete user functionality
    }

    // Function to create a fund
    function createFund() {
        // Redirect to create fund page
        window.location.href = '/create-fund';
    }

    // Function to perform an exchange
    function performExchange() {
        // Redirect to perform exchange page
        window.location.href = '/perform-exchange';
    }
});
