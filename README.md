# 🍽️ Restaurant Website

A full-stack **Restaurant Website** built using **Node.js, Express, MySQL**, and a **static HTML, CSS, and JavaScript frontend**.
This project enables users to explore the restaurant, register and log in securely, place food orders, make table reservations, and view their personal profile.

---

## 🚀 Features

* 🔐 User Authentication (Register & Login using JWT)
* 🔑 Secure Password Hashing with bcrypt
* 👤 User Profile Page
* 🍔 Online Food Ordering
* 🪑 Table Reservation System
* 🌐 RESTful APIs built with Express
* 🗄️ MySQL Database Integration
* 🔄 CORS Enabled for Frontend–Backend Communication

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)
* Served using a local static server

### Backend

* Node.js
* Express.js
* MySQL
* JSON Web Tokens (JWT)
* dotenv for environment variables

---

## 📁 Project Structure

```
restaurant-website/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── package.json
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── profile.html
│   ├── js/
│   └── css/
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd restaurant-website
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend will start on:

```
http://localhost:5000
```

### 3️⃣ Frontend Setup

```bash
cd frontend
python -m http.server 5500
```

Open in browser:

```
http://localhost:5500
```
### 🖼️ Project Preview
<img width="1878" height="911" alt="image" src="https://github.com/user-attachments/assets/b9b467cb-5530-46c7-8d0e-bdc8335c8c2c" />
<img width="1884" height="701" alt="image" src="https://github.com/user-attachments/assets/e9ae804e-1edf-4bd4-bafa-2dfffb892340" />
<img width="1872" height="906" alt="image" src="https://github.com/user-attachments/assets/901fdad4-5c18-4f31-a6b4-fe0f1bcc63a2" />
<img width="1881" height="699" alt="image" src="https://github.com/user-attachments/assets/9f174557-a628-497d-a372-509e8ad49890" />
<img width="1799" height="912" alt="image" src="https://github.com/user-attachments/assets/07781053-392f-4d22-a349-ec0822a30c08" />
<img width="1830" height="912" alt="image" src="https://github.com/user-attachments/assets/94c1c666-f6e2-4dd7-8e1c-a2fe1f055131" />
<img width="1820" height="909" alt="image" src="https://github.com/user-attachments/assets/bd1fa3d8-94e5-4562-81af-de9bdddb940d" />
<img width="1886" height="910" alt="image" src="https://github.com/user-attachments/assets/3d2925f3-7cc9-4803-913d-1ae09daa6b9e" />
<img width="1883" height="908" alt="image" src="https://github.com/user-attachments/assets/ae1cbdb7-32c9-48c9-8ce0-03f596f91cf7" />
<img width="1877" height="911" alt="image" src="https://github.com/user-attachments/assets/493ce24c-7b6d-43bc-a732-327aa060f810" />


## 🌐 Live Demo

https://gastronome-restaurant-website.onrender.com- **frontend**

https://gastronome-restaurant.onrender.com-**Backend**





---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=restaurant_db
JWT_SECRET=your_secret_key
```

---

## 🔗 API Usage Example

```js
fetch("http://localhost:5000/api/profile", {
  headers: {
    Authorization: "Bearer <token>"
  }
});
```

---

## 📌 Future Enhancements

* Admin Dashboard
* Online Payment Integration
* Profile Image Upload
* Order History
* React-Based Frontend

---

## 👨‍💻 Author

**Swayam Sankar Nayak**
Final-year B.Tech Computer Science Engineering Student
Aspiring Full-Stack Developer

---

## 📜 License

This project is developed for learning and portfolio purposes.
