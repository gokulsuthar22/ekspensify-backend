# 🎉 Ekspensify - Your Personal Finance Buddy!

![Node.js](https://img.shields.io/badge/Node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-%23000000.svg?style=for-the-badge&logo=prisma&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23336791.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Redis-%23DC382D.svg?style=for-the-badge&logo=redis&logoColor=white) ![OneSignal](https://img.shields.io/badge/OneSignal-%23FF0000.svg?style=for-the-badge&logo=onesignal&logoColor=white) ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

[![Google Play](https://img.shields.io/endpoint?color=green&logo=google-play&url=https%3A%2F%2Fplay.cuzi.workers.dev%2Fplay%3Fi%3Dcom.ekspensify.app%26l%3DGoogle%2520Play%26m%3Dv%24version)](https://play.google.com/store/apps/details?id=com.ekspensify.app)
[![Google Play](https://img.shields.io/endpoint?color=green&logo=google-play&url=https%3A%2F%2Fplay.cuzi.workers.dev%2Fplay%3Fi%3Dcom.ekspensify.app%26l%3Ddownloads%26m%3D%24totalinstalls)](https://play.google.com/store/apps/details?id=com.ekspensify.app)
![GitHub repo size](https://img.shields.io/github/repo-size/gokulsuthar22/ekspensify-backend.svg?logo=github)

## **🚀 Overview**

Welcome to Ekspensify Backend, the powerful engine behind your personal finance tracking app! Built with Node.js, NestJS, and PostgreSQL, this backend ensures secure, efficient, and scalable financial management. From handling user authentication to managing transactions, it’s designed to keep your data safe and accessible. 💡🔐

### **✨ Why I Built This**

I wanted a robust, scalable, and well-structured backend to support a seamless finance tracking experience. No more slow or unreliable systems—just a fast, secure, and efficient API that powers real-time analytics, budgeting tools, and smooth data handling. This backend is built to make finance tracking reliable, secure, and hassle-free! 🚀

## **🌟 Features**

- 📌 **Track Income & Expenses**: Effortlessly record and keep track of your income and expenses in real time.
- 🏷 **Categories for Income & Expenses**: Includes all standard categories and allows custom categories.
- 📩 **Automatic Tracking via SMS**: Detects transactions from SMS alerts and tracks them in pending transactions for review.
- 💰 **Budget Management**: Create budgets to limit spending and stay on track.
- 🔔 **Budget Alerts**: Get notified when you're approaching or exceeding your budget.
- 🎨 **Modern UI**: Designed for a sleek and intuitive user experience
- 📊 **Dashboard & Analytics**: Break down expenses and income by category with visual insights.
- 🏦 **Multiple Account Tracking**: Manage and track finances separately for different bank accounts.
- ☁ **Cloud Storage:** Your transaction records are securely stored on the server, keeping them safe and accessible.
- 📄 **PDF & CSV Export**: Easily export transaction data for reporting and record-keeping.

## **🎉 Download the App**

You can get the latest version of the app from the Google Play Store:

[<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="80"/>](https://play.google.com/store/apps/details?id=com.memeusix.ekspensify)

## **🛠 Tech Stack**

- **TypeScript** – Used as the primary programming language for the backend.
- **NestJS** – A progressive Node.js framework for building scalable server-side applications.
- **PostgreSQL** – Relational database for efficient and reliable data storage.
- **Prisma** – ORM for database management and queries with TypeScript support.
- **Redis** – In-memory data store for caching and real-time data processing.
- **Docker** – Containerization for consistent and scalable deployments.
- **AWS (EC2 / S3)** – EC2 for hosting the backend, and S3 for file storage and management.
- **Onesignal** – Onesignal for sending real time notifications to app client.

## **📸 Screenshots**

<img src="https://ekspensify-aws-bucket.s3.ap-south-1.amazonaws.com/Feature+graphic.png" alt="preview"/>

<br/>

<img src="https://ekspensify-aws-bucket.s3.ap-south-1.amazonaws.com/Feature+graphic-1.png" alt="preview"/>

## **🔧 Installation & Setup**

This is a complete **backend** that interacts with a database. While you can't fully utilize all features without a connected database and environment setup, you can still run it locally for testing and development.

### Run Project Without Docker:

- Clone the repository:

  ```bash
  git clone https://github.com/gokulsuthar22/ekspensify-backend.git .
  ```

- Create `.env` file

  ```bash
  touch .env
  ```

- Copy content of `.sample.env` to `.env`:

  ```bash
  cp .env.sample .env
  ```

- Replace placeholder values (your_db_user, your_jwt_secret, etc.) with your actual credentials, eg.

  ```bash
  ...
  DATABASE_USER=postgres
  DATABASE_PASSWORD=mydbpass
  ...
  ```

- Install dependencies

  ```bash
  npm install
  ```

- Start the server

  ```bash
  npm run start:dev
  ```

### Run Project Using Docker:

- Clone the repository:

  ```bash
  git clone https://github.com/gokulsuthar22/ekspensify-backend.git .
  ```

- Create `.env.dev` file

  ```bash
  touch .env.dev
  ```

- Copy content of `.sample.env` to `.env.dev`:

  ```bash
  cp .env.sample .env.dev
  ```

- Replace placeholder values (your_db_user, your_jwt_secret, etc.) with your actual credentials, eg.

  ```bash
  ...
  DATABASE_USER=postgres
  DATABASE_PASSWORD=mydbpass
  ...
  ```

- Start the server using docker compose

  ```bash
  docker-compose -f docker-compose.dev.yml --env-file .env.dev up --build
  ```

## **🤝 Contributing**

Enjoying this project? Help make it even better! 🚀 **Report issues, contribute code, or share your ideas**—let’s create something awesome together. 💡💻

## **📬 Let's Connect!**

Got feedback or ideas? Reach out to me! I’d love to hear from you. 🎉

- 📧 Email: team@ekspensify.in
- 💼 LinkedIn: [Gokul Suthar | LinkedIn](https://www.linkedin.com/in/gokulsuthar22/)
