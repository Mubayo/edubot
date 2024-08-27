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

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Handle signup logic here
    // http://127.0.0.1:8000/edubot/users/
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        fetch('http://localhost:8000/edubot/users/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.id) {
                alert('Registration successful! Please login.');
                window.location.href="/login.html"
                // registerForm.style.display = 'none';
                // loginForm.style.display = 'block';
            } else {
                alert('Registration failed! Please try again.');
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
        
        // Optionally add more checks, like token expiration
        return true;
    }
    
    
    });