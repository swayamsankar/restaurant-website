// =========================
// GLOBAL API URL
// =========================
const API_BASE = "http://localhost:5000/api";


// =========================
// PAGE LOAD EVENT
// =========================
document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // 1. LOAD MENU FROM BACKEND
    // =========================
    if (document.getElementById('menu-container')) {
        fetch(`${API_BASE}/menu`)
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('menu-container');
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'menu-item';
                    div.dataset.name = item.name;
                    div.dataset.price = item.price;

                    div.innerHTML = `
                        <img src="${item.imageUrl}" width="200">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>Price: ₹${item.price}</p>
                        <button onclick="addToCart(this)">Add to Cart</button>
                    `;
                    container.appendChild(div);
                });
            });
    }


    // =========================
    // 2. RESERVATION FORM
    // =========================
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const token = localStorage.getItem("token");
            if (!token) {
                alert("Please login first.");
                window.location.href = "login.html";
                return;
            }

            const data = Object.fromEntries(new FormData(reservationForm).entries());

            fetch(`${API_BASE}/reservations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(result => {
                    document.getElementById('reservation-response').textContent = result.message;
                    reservationForm.reset();
                });
        });
    }


    // =========================
    // 3. CONTACT FORM
    // =========================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const loader = document.querySelector('.submit-loader');
        const text = document.querySelector('.submit-text');
        const successMsg = document.getElementById('successMsg');
        const errorMsg = document.getElementById('errorMsg');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            loader.style.display = 'inline-block';
            text.style.display = 'none';
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            const formData = new FormData(contactForm);

            fetch("https://script.google.com/macros/s/AKfycbwTTUEz4M9-STTK8Y9-kna0IXCpETzUys9BJg5bIjyXugQ6mq2tOJIdeO3jkY5nTlqy/exec", {
                method: "POST",
                body: formData
            })
                .then(res => res.json())
                .then(() => {
                    loader.style.display = 'none';
                    text.style.display = 'inline-block';
                    successMsg.style.display = 'block';
                })
                .catch(err => {
                    loader.style.display = 'none';
                    text.style.display = 'inline-block';
                    errorMsg.textContent = `❌ ${err.message}`;
                    errorMsg.style.display = 'block';
                });
        });
    }


    // =========================
    // 4. MOBILE MENU
    // =========================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNavOverlay.classList.remove('active');
            });
        });
    }


    // =========================
    // 5. Show LOGIN / LOGOUT in Navbar
    // =========================
    const loginNav = document.getElementById("loginLink");
    const logoutNav = document.getElementById("logoutLink");

    const token = localStorage.getItem("token");

    if (loginNav && logoutNav) {
        if (token) {
            loginNav.style.display = "none";
            logoutNav.style.display = "inline-block";
        } else {
            logoutNav.style.display = "none";
            loginNav.style.display = "inline-block";
        }

        logoutNav.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });
    }


    // =========================
    // 6. Render Cart on Load
    // =========================
    renderCart();
});


// =======================================
// CART SYSTEM
// =======================================
function addToCart(btn) {
    const item = btn.closest(".menu-item");
    const name = item.dataset.name;
    const price = parseFloat(item.dataset.price);

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ name, price });

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


function renderCart() {
    const ul = document.getElementById("cart-items");
    if (!ul) return;

    ul.innerHTML = "";

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.forEach(it => {
        const li = document.createElement("li");
        li.textContent = `${it.name} - ₹${it.price}`;
        ul.appendChild(li);
    });
}


// =======================================
// PLACE ORDER
// =======================================
async function placeOrder() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
        alert("Cart empty.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    const res = await fetch(`${API_BASE}/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ items: cart, total })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Order placed! Order ID: " + data.orderId);
        localStorage.removeItem("cart");
        renderCart();
    } else {
        alert("Order failed: " + data.error);
    }
}


// =======================================
// LOGOUT FUNCTION (used globally)
// =======================================
function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
