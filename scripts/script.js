document.addEventListener("DOMContentLoaded", async () => {
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const logoutButton = document.getElementById("logoutBtn");
    const messages = document.getElementById("messages");
    var a_token;


    const appendMessage = (message, sender) => {
        const messageElem = document.createElement("div");
        messageElem.classList.add("message", sender);
        messageElem.innerText = message;
        messages.appendChild(messageElem);
        messages.scrollTop = messages.scrollHeight;
    };

    // Check if user is authenticated
    if (isAuthenticated()) {
        // authContainer.style.display = 'none';
        // chatContainer.style.display = 'block';
        const messages = await getMessages();
        messages.forEach(element => {
            appendMessage(element["content"], "user");
            appendMessage(element["response"], "bot");
            
        });
    } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href="login.html";
    }

    

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href="login.html"
    });

    const getBotResponse = async (userMessage) => {
        try {
            let accessToken = localStorage.getItem('accessToken');

    // Check if access token is expired
    if (isTokenExpired(a_token)) {
        await refreshToken();
        a_token = localStorage.getItem('accessToken'); // Get the new access token
    }
            // const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            const response = await fetch('http://127.0.0.1:8000/edubot/messages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${a_token}`
                },
                body: JSON.stringify({
                    content: userMessage,
                    // max_tokens: 150
                })
            });

            if (response.status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
                window.location.href="login.html"
            }
            const data = await response.json();
            console.log(data.message.response)
            return data.message.response;
        } catch (error) {
            // console.error("Error fetching response:", error);
            // if (response.status === 401) {
            //     // Handle unauthorized access (e.g., redirect to login)
            //     window.location.href="login.html"
            // }
            return "Sorry, I couldn't process that. Please try again.";
        }
    };
    async function getMessages() {
        try {
            // let accessToken = localStorage.getItem('accessToken');

    // Check if access token is expired
    if (isTokenExpired(a_token)) {
        await refreshToken();
        a_token = localStorage.getItem('accessToken'); // Get the new access token
    }
            // const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
            const response = await fetch('http://127.0.0.1:8000/edubot/messages/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${a_token}`
                },
                // body: JSON.stringify({
                //     content: userMessage,
                //     // max_tokens: 150
                // })
            });

            if (response.status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
                window.location.href="login.html"
            }
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            console.error( error);
            // if (response.status === 401) {
            //     // Handle unauthorized access (e.g., redirect to login)
            //     window.location.href="login.html"
            // }
            return "Sorry, I couldn't process that. Please try again.";
        }
    };

    sendBtn.addEventListener("click", async () => {
        const userMessage = userInput.value;
        if (userMessage.trim() !== "") {
            appendMessage(userMessage, "user");
            userInput.value = "";
            const botResponse = await getBotResponse(userMessage);
            appendMessage(botResponse, "bot");
        }
    });

    userInput.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            sendBtn.click();
        }
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

    async function refreshToken() {
        try {
            const response = await fetch('http://127.0.0.1:8000/edubot/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refresh: localStorage.getItem('refreshToken') // Get refresh token from storage
                })
            });
    
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.access); // Save new access token
                localStorage.setItem('refreshToken', data.refresh); // Save new refresh token if rotated
            } else {
                console.error('Failed to refresh token');
                window.location.href="login.html"
                // Handle token refresh failure (e.g., redirect to login)
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., redirect to login)
        }
    }


function isTokenExpired(token) {
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() > exp;
}
    
});
