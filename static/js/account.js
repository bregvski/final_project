"use strict";

const userToken = localStorage.getItem('userToken')
const errorContainer = document.getElementById("error_container");
const loginForm = document.getElementById("loginForm")

console.log(userToken);
function loadForm() {
  if(userToken) {
    loginForm.innerHTML = '<h2>Logout</h2><button type="submit" class="btn">Log out</button>'
  }
}

function handleLogout(event) {
  event.preventDefault();
  localStorage.removeItem('userToken');
  location.href = '/index.html';
}

async function handleLogin(event) {
  event.preventDefault();
  errorContainer.innerText = "";
  const formData = new FormData(event.target);

  const username = formData.get("username");
  const password = formData.get("password");
  const response = await fetch("https://dummyjson.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 60,
    }),
  });
  if (!response.ok) errorContainer.innerText = (await response.json()).message;
  const user = await response.json()
  localStorage.setItem('userToken', user.token);
  location.href = '/index.html';

}

loadForm();

loginForm.addEventListener("submit", userToken ? handleLogout : handleLogin);
