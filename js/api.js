const backendUrl = window.location.host === 'localhost' ? 'http://localhost:3000' : 'https://failing-calculator-backend.onrender.com';
const accessTokenKey = 'accessToken';

function getAccessToken() {
  return localStorage.getItem(accessTokenKey);
}

function setAccessToken(token) {
  localStorage.setItem(accessTokenKey, token);
}

function clearAccessToken() {
  localStorage.removeItem(accessTokenKey);
}

function isLoggedIn() {
  return Boolean(getAccessToken());
}

function requireAuth(redirectPath) {
  if (!isLoggedIn()) {
    window.location.assign(redirectPath || '/admin-login');
    return false;
  }
  return true;
}

function invalidateTemplateCache() {
  localStorage.removeItem('version');
  localStorage.removeItem('templates');
  localStorage.removeItem('lastUpdated');
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${backendUrl}${path}`, {
    ...options,
    headers,
  });

  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(result.messageDetail || result.message || `Request failed with status ${response.status}`);
  }

  return result;
}

async function login(username, password) {
  const result = await apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (!result.data) {
    throw new Error('Login response did not include an access token');
  }

  setAccessToken(result.data);
  return result;
}

async function createCourse({ course, isUpdateVersion, updateMessage, updatedTemplates }) {
  return apiRequest('/course', {
    method: 'POST',
    body: JSON.stringify({
      isUpdateVersion,
      updateMessage,
      updatedTemplates,
      course,
    }),
  });
}

async function updateCourse(course, version) {
  return apiRequest('/course', {
    method: 'PUT',
    body: JSON.stringify({ oldCourseName: courseName, course, version }),
  });
}

async function deleteCourse(courseName) {
  return apiRequest('/course', {
    method: 'DELETE',
    body: JSON.stringify({ courseName }),
  });
}

function logout() {
  clearAccessToken();
  window.location.assign('/');
}

function updateAdminNav() {
  const navItem = document.getElementById('adminNavItem');
  if (!navItem) {
    return;
  }

  if (isLoggedIn()) {
    navItem.innerHTML = `
      <a class="nav-link" href="#" id="logoutLink" style="font-family: Poppins; font-size: 1.1rem;">Logout</a>
    `;
    document.getElementById('logoutLink').addEventListener('click', (event) => {
      event.preventDefault();
      logout();
    });
  } else {
    const loginPath = navItem.dataset.loginPath || 'admin-login';
    navItem.innerHTML = `
      <a class="nav-link" href="${loginPath}" style="font-family: Poppins; font-size: 1.1rem;">Admin</a>
    `;
  }
}
