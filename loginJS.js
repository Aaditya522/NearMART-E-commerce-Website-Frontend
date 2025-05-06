let loginBtn = document.getElementById("btn2");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("pass");
let loginForm = document.getElementById("login-form");

loginBtn.addEventListener('click', function(event) {
    event.preventDefault();

    // Basic Validation
    if (!emailInput.value.trim() || !passwordInput.value.trim()) {
        alert("Please enter both email and password.");
        return;
    }

    fetch("http://localhost:3001/api/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: emailInput.value,
            pass: passwordInput.value
        })
    })
    .then(response => {
        console.log("Response:", response);
        return response.json();
    })
    .then(data => {
        console.log("Response Data:", data);
        if (data.success) {
            alert("Successfully Logged In");
            window.location.href = "UI-2.html";
        } else {
            alert(data.message || "Login failed. Invalid credentials.");
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        alert("An error occurred during login.");
    });
});