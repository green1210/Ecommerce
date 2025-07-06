# 🛍️ Zenlify - ECommerce Web Application

**Zenlify** is a modern and scalable e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) and **Vite**. It enables users to browse products, register/login, manage cart items, and complete the checkout process with a smooth user experience and intuitive interface.

---

## 📸 Screenshots

### 🏠 Home Page

![Home Page](./screenshots/home.png)

### 🛒 Product Page

![Product Page](./screenshots/product.png)

---

## 🔗 Live Demo

**🌐 [Live Project on Vercel](https://zenlify.vercel.app/)**  
_Deployed with Vercel for global accessibility and blazing-fast performance._

---

## 📦 Tech Stack

### 🔹 Frontend
- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- Axios

### 🔹 Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

---

## 🌟 Features

- 🔐 User authentication (Login / Register)
- 🛒 Cart system with add/remove/update quantity
- 📄 Product listing & detail pages
- ✅ Checkout flow
- ⚛️ Reusable React components
- ⚙️ Modular folder structure for scalability
- 🔄 State management using Redux Toolkit

---

## 📁 Project Structure

E_commerce/
├── public/
├── server/
│ ├── routes/
│ │ ├── auth.js
│ │ └── products.js
│ └── index.js
├── src/
│ ├── components/
│ │ ├── cart/
│ │ ├── layout/
│ │ ├── products/
│ │ └── ui/
│ ├── pages/
│ │ ├── CartPage.jsx
│ │ ├── CheckoutPage.jsx
│ │ ├── HomePage.jsx
│ │ ├── LoginPage.jsx
│ │ ├── NotFoundPage.jsx
│ │ ├── ProductDetailPage.jsx
│ │ ├── ProductsPage.jsx
│ │ ├── ProfilePage.jsx
│ │ └── RegisterPage.jsx
│ ├── services/
│ │ └── api.js
│ ├── store/
│ │ ├── slices/
│ │ │ ├── authSlice.js
│ │ │ ├── cartSlice.js
│ │ │ ├── productsSlice.js
│ │ │ └── uiSlice.js
│ │ └── index.js
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env
├── package.json
├── tailwind.config.js
├── vite.config.js


---

## 📦 Installation & Setup

### Clone the repository

```bash

git clone https://github.com/yourusername/zenlify.git

# Navigate to the project
cd zenlify

# Install dependencies
npm install

# Run the development server
npm run dev

