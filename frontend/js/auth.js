const API_BASE = "https://gastronome-restaurant.onrender.com/api";

async function signup(){
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Signup success! Please login.");
    window.location.href = "login.html";
  } else {
    alert("Error: " + (data.error || "unknown"));
  }
}

async function login(){
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok && data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user || {}));
    window.location.href = "index.html";
  } else {
    alert("Login failed: " + (data.error || "unknown"));
  }
}
