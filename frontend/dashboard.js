window.onload = function () {
    let count = localStorage.getItem("pomodoroCount") || 0;
    document.getElementById("ppomodoroCountDisplay").innerText = `Pomodoros Completed: ${count}`;
};

// login function to call the backend API
function login(username, password) {
    fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.access_token) {
            localStorage.setItem('jwt_token', data.access_token);  // Store JWT token
            alert('Login successful!');
        } else {
            alert('Invalid credentials');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function getPomodoros() {
    const token = localStorage.getItem('jwt_token');  // Get JWT token from localStorage
    if (!token) {
        alert('You must be logged in to view your Pomodoros.');
        return;
    }

    fetch('http://localhost:5000/pomodoros', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,  // Add JWT token to request headers
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const pomodoroList = document.getElementById('pomodoroList');  // Assume you have a div with this ID
        pomodoroList.innerHTML = '';  // Clear previous sessions
        data.forEach((pomodoro) => {
            const pomodoroItem = document.createElement('li');
            pomodoroItem.textContent = `Pomodoro ${pomodoro.id}: ${pomodoro.duration} minutes, completed at ${new Date(pomodoro.completed_at).toLocaleString()}`;
            pomodoroList.appendChild(pomodoroItem);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
