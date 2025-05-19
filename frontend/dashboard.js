window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromURL = urlParams.get('token');
    if (tokenFromURL) {
        localStorage.setItem('jwt_token', tokenFromURL);
        // Optional: Clear the token from URL
        window.history.replaceState({}, document.title, "/frontend/dashboard.html");
    }

    const token = localStorage.getItem('jwt_token');

    // 
    removeLogin();
    if (!token) {
        alert('You must be logged in to view your Pomodoros.');
        return;
    }

    getPomodoroHistory(token);    // ← Get Pomodoro stats
};


// Function to fetch and display Pomodoro history
function getPomodoroHistory(token) {
    fetch('http://127.0.0.1:5000/pomodoro/history', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            alert('Error fetching Pomodoro data: ' + data.error);
            return;
        }

        // 👇 Set user info
        document.getElementById('user-name').innerText = data.user_name;
        document.getElementById('user-email').innerText = data.user_email;

        // Set pomodoro count
        document.getElementById('pomodoroCountDisplay').innerText = `Pomodoros Completed: ${data.total_completed}`;

        // Render history
        const pomodoroList = document.getElementById('pomodoroList');
        pomodoroList.innerHTML = '';  // Clear previous data

        data.history.forEach((session) => {
            const pomodoroItem = document.createElement('li');
            pomodoroItem.textContent = `Session: ${session.session_name}, Pomodoros: ${session.pomodoros}, Completed at: ${new Date(session.timestamp).toLocaleString()}`;
            pomodoroList.appendChild(pomodoroItem);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Function to log a Pomodoro session (from your frontend)
function logPomodoro(pomodoros, sessionName) {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        alert('You must be logged in to log Pomodoros.');
        return;
    }

      
    fetch('http://127.0.0.1:5000/pomodoro/log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            
        },
        body: JSON.stringify({
            pomodoros: pomodoros,
            session_name: sessionName,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.error) {
            alert('Error logging Pomodoro: ' + data.error);
            return;
        }

        alert('Pomodoro logged successfully!');
        getPomodoroHistory(token); // Refresh history after logging a Pomodoro
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// this jazz is some cool jazz
function logout(){
    localStorage.removeItem("jwt_token");
    window.location.href="/frontend/dashboard.html";
}


// this is some more cool jazz hehe hi agrima :)
function removeLogin() {
    const token = localStorage.getItem("jwt_token");
    const loginBtn = document.getElementById("loginBtn");

    if (token && loginBtn) {
        loginBtn.style.display = "none";
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.tab-content');
    sections.forEach(section => section.style.display = 'none');
  
    // Remove active class from all sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar li');
    sidebarItems.forEach(item => item.classList.remove('active'));
  
    // Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) {
      activeSection.style.display = 'block';
    }
  
    // Set active sidebar link
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
      if (link.getAttribute('onclick')?.includes(sectionId)) {
        link.parentElement.classList.add('active');
      }
    });
  }
  
  window.onload = () => {
    showSection('home-section');
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jwt_token', token);
      // Optionally remove token from URL for clean UI
      window.history.replaceState({}, document.title, "/dashboard.html");
    }
  };
  

