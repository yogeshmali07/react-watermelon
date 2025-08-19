Offline ToDo Sync (React Native + Node.js + MySQL)

This project is a full-stack offline-first To-Do app.
It demonstrates how to use WatermelonDB
 in a React Native client for offline persistence, and a Node.js + MySQL backend for data synchronization.

The app allows users to:
✅ Create and update to-do items offline
✅ Automatically sync changes when online
✅ Keep the database consistent between device and server

📂 Project Structure
offline-todo-sync/
│── client/   # React Native app (WatermelonDB)
│── server/   # Node.js + MySQL sync server
│── README.md # This file


🚀 Features

Offline-first with WatermelonDB
Bi-directional sync (push local changes, pull server updates)
React Native UI with toast notifications for sync
Backend API built with Node.js + Express + MySQL


⚙️ Setup Instructions
1. Clone the repo
git clone https://github.com/YOUR_USERNAME/offline-todo-sync.git
cd offline-todo-sync

2. Backend (Server)

Go into the server folder:

cd server


Install dependencies:

npm install


Configure MySQL:

Create a database react_watermelon

Run the schema:

CREATE TABLE `todos` (
  `id` varchar(36) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `is_done` tinyint(1) DEFAULT '0',
  `updated_at` bigint DEFAULT NULL,
  `_status` varchar(20) DEFAULT NULL,
  `_changed` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


Start the server:

npm start

Server runs by default on:
👉 http://localhost:4000

3. Client (React Native App)

Go into the client folder:

cd ../client


Install dependencies:

npm install


Update the backend URL:
In src/database/sync.js, replace the IP with your machine’s local network IP (e.g. 192.168.x.x) so the mobile device can reach it. Example:

const SYNC_URL = "http://192.168.1.4:4000/sync";


Run the app:

For Android:

npx react-native run-android


For iOS:

npx react-native run-ios


Debug logs:

Android: adb logcat *:S ReactNative:V ReactNativeJS:V

iOS: See Metro logs in terminal

🔄 Sync Flow

User creates/updates todos locally → stored in WatermelonDB

When sync is triggered:

Push local changes → server inserts/updates MySQL

Pull server changes → WatermelonDB updates client DB

Toast notification shows sync success/failure

📸 Screenshots (optional)

(Add later: screenshots of your To-Do list and sync logs)

🛠 Tech Stack

Frontend: React Native 0.80 + WatermelonDB

Backend: Node.js (Express) + MySQL

Database: MySQL 8+

🤝 Contributing

PRs welcome! Open an issue if you find a bug or have feature ideas.

📄 License

MIT