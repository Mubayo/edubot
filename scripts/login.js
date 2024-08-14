document.addEventListener("DOMContentLoaded", () => {
    var a_token;

    // Check if user is authenticated
    if (isAuthenticated()) {
        // authContainer.style.display = 'none';
        // chatContainer.style.display = 'block';
        window.location.href="index.html";
    } else {
        // window.location.href="login.html";
    }

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle login logic here
    // http://127.0.0.1:8000/edubot/api/token/
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:8000/edubot/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access && data.refresh) {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            // authContainer.style.display = 'none';
            // chatContainer.style.display = 'block';
            alert(' Logn successfully');
            window.location.href="/index.html"
        } else {
            alert('Login failed! Please try again.');
        }
    })
    .catch(error => console.error('Error:', error));
});

    function isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    a_token = token;
    if (!token) {
        return false;
    }
    if (isTokenExpired(a_token)) {
        // await refreshToken();
        // a_token = localStorage.getItem('accessToken'); // Get the new access token
        localStorage.removeItem('accessToken');
        return false;
    }else{
        return true;
    }
    
    // Optionally add more checks, like token expiration
}

function isTokenExpired(token) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
}

});