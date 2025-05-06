let btn = document.getElementById("btn");
let signupForm = document.getElementById("sign-up");

let firstNameInput = document.getElementById("firstName");
let lastNameInput = document.getElementById("lastName");
let emailInput = document.getElementById("email");
let passwordInput = document.getElementById("pass");
let phoneInput = document.getElementById("phone");

btn.addEventListener('click', function(event) {
    event.preventDefault();

    if (!firstNameInput.value.trim() || !lastNameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value.trim() || !phoneInput.value.trim()) {
        alert("Please fill in all fields.");
        return;
    }
    
    fetch("http://localhost:3001/api/auth/register`", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            phone: phoneInput.value
        })
    })

    .then(response => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.success) {
            alert("User Successfully Created! Please Log in.");
            window.location.href = "login page.html";
        } else {
            alert(data.message || "Signup Failed");
        }
    })
    .catch(error => {
        console.error("Error during signup:", error);
        alert("An error occurred during signup: " + error.message);
    });
});
