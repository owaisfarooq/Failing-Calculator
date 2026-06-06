if (isLoggedIn()) {
  window.location.assign('/');
}

updateAdminNav();

const loginForm = document.getElementById('loginForm');
const loginAlert = document.getElementById('loginAlert');
const loginButton = document.getElementById('loginButton');

function showLoginError(message) {
  loginAlert.textContent = message;
  loginAlert.classList.remove('d-none');
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginAlert.classList.add('d-none');
  loginButton.disabled = true;
  loginButton.textContent = 'Signing in...';

  try {
    await login(
      document.getElementById('username').value.trim(),
      document.getElementById('password').value
    );
    window.location.assign('/');
  } catch (error) {
    showLoginError(error.message || 'Login failed');
    loginButton.disabled = false;
    loginButton.textContent = 'Sign in';
  }
});
