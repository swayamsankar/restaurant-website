const chatbotIcon = document.getElementById("chatbot-icon");
const chatbotBox = document.getElementById("chatbot-box");
const chatArea = document.getElementById("chat-area");
const closeBtn = document.getElementById("chatbot-close");

chatbotIcon.onclick = () => {
    chatbotBox.style.display = "flex";
    chatbotIcon.style.display = "none";
    greetUser();
};

closeBtn.onclick = () => {
    chatbotBox.style.display = "none";
    chatbotIcon.style.display = "flex";
};

// SAVE CHAT HISTORY
if (localStorage.getItem("chatHistory")) {
    chatArea.innerHTML = localStorage.getItem("chatHistory");
    chatArea.scrollTop = chatArea.scrollHeight;
}

function saveChat() {
    localStorage.setItem("chatHistory", chatArea.innerHTML);
}

// GREETING MESSAGE
function greetUser() {
    botMessage("👋 Hello! How can I assist you today?");
}

// CATEGORY QUESTIONS
const questions = {
    menu: [
        { q: "Show me vegetarian dishes", a: "Here are our veg dishes: Paneer Butter Masala, Mushroom Risotto, Rajma Masala, Onion Bhaji, Aloo Tikki, Dal Makhani, Kadai Paneer 🍛" },
        { q: "Show me non-veg dishes", a: "Non-veg dishes include Grilled Salmon, Chicken Tikka Masala, Chicken Chettinad, Rogan Josh, Butter Chicken, Chicken Korma, Fish Amritsari 🍗" },
        { q: "What desserts do you have?", a: "Our dessert menu features Gulab Jamun, Gajar Halwa, and Kulfi 🍦. Please note, these are only available for in-restaurant dining." },
        { q: "What drinks are available?", a: "We offer a variety of soft drinks, fresh juices, and traditional Indian beverages like Lassi 🍹. Please note, these are only available for in-restaurant dining." }
    ],
    delivery: [
        { q: "Do you provide delivery?", a: "Yes! We provide delivery within 5km radius. 🚚" },
        { q: "How long does delivery take?", a: "Usually 45–60 minutes depending on location." },
        { q: "What are the delivery charges?", a: "Delivery charges vary based on distance, starting from ₹50." },
        { q: "Can I track my order?", a: "Yes, you will receive a tracking link via SMS once your order is dispatched." }
    ],
    timing: [
        { q: "When are you open?", a: "We are open daily from 10 AM to 11 PM ⏱" },
        { q: "Do you take online orders at night?", a: "Yes, until 11 PM." },
        { q: "Are you open on weekends?", a: "Yes, we are open on weekends with the same timings: 10 AM to 11 PM." },
        { q: "What are your holiday hours?", a: "Our holiday hours may vary. Please check our website or call us for specific holiday timings." }
    ],
    support: [
        { q: "Contact number?", a: "📞 You can reach us at +91 98765 43210" },
        { q: "How to cancel order?", a: "Please contact support within 5 minutes of placing the order." },
        { q: "What is your refund policy?", a: "Refunds are processed for cancelled orders or in case of quality issues. Please contact support for details." },
        { q: "How can I give feedback?", a: "We appreciate your feedback! You can leave a review on our website or speak to a manager during your visit." }
    ]
};

// DISPLAY TYPING + BOT MESSAGE
function botMessage(text) {
    let typing = document.createElement("div");
    typing.className = "chat-bubble bot-bubble typing";
    typing.textContent = "typing...";
    chatArea.appendChild(typing);
    scrollDown();

    setTimeout(() => {
        typing.remove();

        let bubble = document.createElement("div");
        bubble.className = "chat-bubble bot-bubble";
        bubble.textContent = text;
        chatArea.appendChild(bubble);
        scrollDown();
        saveChat();
    }, 900);
}

// USER MESSAGE
function userMessage(text) {
    let bubble = document.createElement("div");
    bubble.className = "chat-bubble user-bubble";
    bubble.textContent = text;
    chatArea.appendChild(bubble);
    scrollDown();
    saveChat();
}

// SCROLL
function scrollDown() {
    chatArea.scrollTop = chatArea.scrollHeight;
}

// CATEGORY BUTTON CLICK
document.querySelectorAll(".chat-option").forEach(btn => {
    btn.onclick = () => {
        let category = btn.dataset.category;
        showQuestions(category);
    };
});

function showQuestions(category) {
    botMessage("Choose a question:");

    questions[category].forEach(item => {
        let btn = document.createElement("button");
        btn.className = "chat-option";
        btn.textContent = item.q;

        btn.onclick = () => {
            userMessage(item.q);
            botMessage(item.a);
            btn.remove();
        };

        chatArea.appendChild(btn);
    });

    scrollDown();
}
