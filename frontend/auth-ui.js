document.addEventListener('DOMContentLoaded', async () => {
    // Check existing session on load
    const currentUser = await Auth.checkSession();
    if (currentUser) showLoggedInView(currentUser);
  
    // Login form
    document.getElementById('login-btn').addEventListener('click', async () => {
      try {
        await Auth.login(
          document.getElementById('login-username').value,
          document.getElementById('login-password').value
        );
        showLoggedInView(document.getElementById('login-username').value);
      } catch (error) {
        alert(error.message);
      }
    });
  
    // Signup form
    document.getElementById('signup-btn').addEventListener('click', async () => {
      try {
        await Auth.signUp(
          document.getElementById('signup-username').value,
          document.getElementById('signup-password').value
        );
        alert("Account created! Log in now.");
        toggleForms();
      } catch (error) {
        alert(error.message);
      }
    });
  
    // Logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
      await Auth.logout();
      toggleForms();
    });
  
    // Form toggles
    document.getElementById('show-signup').addEventListener('click', toggleForms);
    document.getElementById('show-login').addEventListener('click', toggleForms);
  });
  
  function showLoggedInView(username) {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('logged-in-view').style.display = 'block';
    document.getElementById('logged-in-username').textContent = username;
  }
  
  function toggleForms() {
    document.getElementById('login-form').style.display = 
      document.getElementById('login-form').style.display === 'none' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = 
      document.getElementById('signup-form').style.display === 'none' ? 'block' : 'none';
    document.getElementById('logged-in-view').style.display = 'none';
  }