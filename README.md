# 🛡️ WeKeep Warranty Management System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)](https://www.mongodb.com/)
[![Twilio](https://img.shields.io/badge/SMS-Twilio-red?logo=twilio)](https://www.twilio.com/)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-yellow?logo=gmail)](https://nodemailer.com/)

---

## 🚧 Project Status

> **This project is currently in progress.**
> - Features and UI are being actively developed.
> - Contributions and suggestions are welcome!

---

## ✨ Features

- **Add & Manage Warranties:**  
  Users can add product warranty details, upload receipts, and attach their email and mobile number.
- **Automated Notifications:**  
  Sends email & SMS alerts at 60, 30, 15, and 3 days before warranty expiry.
- **Service History Tracking:**  
  Service persons can add and view service records for each product.
- **Secure & Modern Stack:**  
  Node.js, Express, MongoDB, Nodemailer (Gmail), and Twilio (SMS).

---

## 🚀 Getting Started

### 1. **Clone the Repository**

git clone https://github.com/yourusername/wekeep-webapp.git<br>
cd wekeep-webapp

### 2. **Install Dependencies**<br>

npm install

### 3. **Environment Variables**

Create a `.env` file in the **project root** and add:

EMAIL_USER=your-email@gmail.com<br>
EMAIL_PASSWORD=your-gmail-app-password<br>

TWILIO_ACCOUNT_SID=your_twilio_sid<br>
TWILIO_AUTH_TOKEN=your_twilio_auth_token<br>
TWILIO_PHONE_NUMBER=+1234567890<br>

- For **Gmail**, use an [App Password](https://support.google.com/accounts/answer/185833?hl=en).
- For **Twilio**, use your trial or production credentials.

### 4. **Start MongoDB**

- If using local MongoDB,<br> run:
mongod-<br> If using MongoDB Atlas,<br> ensure your URI is set in `src/backend/Database.js`.

### 5. **Run the Backend**

node src/backend/Express.js
### 6. **Access the Frontend**

- Open your frontend (React/Next.js) as per your setup. <br>
npm start
---

## 🛠️ Notification Automation

- The backend **automatically checks for expiring warranties daily at 9 AM** (server time) and sends notifications.
- For testing, a notification check runs 10 seconds after server start.

---

## 📲 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Email:** Nodemailer (Gmail SMTP)
- **SMS:** Twilio
- **Scheduler:** node-cron

---

## 📝 Example `.env` File

EMAIL_USER=your-email@gmail.com<br>
EMAIL_PASSWORD=your-app-password

TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890
---

## ⚠️ Notes

- **Twilio Free Trial:** You can only send SMS to verified numbers. [Learn more](https://www.twilio.com/console/phone-numbers/verified).
- **Gmail App Password:** [How to generate](https://support.google.com/accounts/answer/185833?hl=en).
- **Do not share your `.env` file or credentials publicly.**

---

## 🤝 Contributing

Pull requests, issues, and feature suggestions are welcome!

---

## 📧 Contact

For questions, contact [aaditya303gupta@gmail.com](mailto:aaditya303gupta@gmail.com).

---

