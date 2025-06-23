// Load menu items dynamically
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('menu-container')) {
        fetch('http://localhost:5000/api/menu')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('menu-container');
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'menu-item';
                    div.innerHTML = `
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                        <p>Price: ₹${item.price}</p>
                        <img src="${item.imageUrl}" alt="${item.name}" width="200" />
                    `;
                    container.appendChild(div);
                });
            });
    }

    // Reservation Form
    const reservationForm = document.getElementById('reservation-form');
    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(reservationForm);
            const data = Object.fromEntries(formData.entries());
            fetch('http://localhost:5000/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => {
                document.getElementById('reservation-response').textContent = result.message;
                reservationForm.reset();
            });
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('.form-submit');
    const loader = contactForm.querySelector('.submit-loader');
    const text = contactForm.querySelector('.submit-text');
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');
  
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Stop default form action
  
        // Show loader
        loader.style.display = 'inline-block';
        text.style.display = 'none';
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
  
        // Submit using Fetch API
        const formData = new FormData(contactForm);
        fetch('https://script.google.com/macros/s/AKfycbwTTUEz4M9-STTK8Y9-kna0IXCpETzUys9BJg5bIjyXugQ6mq2tOJIdeO3jkY5nTlqy/exec', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            loader.style.display = 'none';
            text.style.display = 'inline-block';
  
            successMsg.textContent = '✅ Message submitted successfully!';
            successMsg.style.display = 'block';
        })
        .catch(err => {
            loader.style.display = 'none';
            text.style.display = 'inline-block';
            errorMsg.textContent = `❌ ${err.message}`;
            errorMsg.style.display = 'block';
        });
    });

    // Mobile Menu Button Functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
    }

    // Close menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
        });
    });

    // Attach to button
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    // Attach to button
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
});
