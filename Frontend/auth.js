const API_BASE_URL = 'http://localhost:3000/api/auth';
const loginForm = document.getElementById('loginForm');
const messageElement = document.getElementById('message');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // Crucial for session-based auth to send cookies
                credentials: 'include', 
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Backend sends the redirect URL based on role
                messageElement.style.color = 'green';
                messageElement.textContent = 'Login successful! Redirecting...';
                
                // Redirect user to their respective portal
                window.location.href = data.redirectUrl; 
            } else {
                messageElement.textContent = data.message || 'Login failed.';
            }
        } catch (error) {
            console.error('Login error:', error);
            messageElement.textContent = 'An unexpected error occurred.';
        }
    });
}