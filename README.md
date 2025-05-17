# 📚 Librena - Your Software Library Explorer

Librena is a comprehensive web application that helps developers discover, compare, and manage software libraries for their projects. With a beautiful UI, personalized user features, and seamless project organization, Librena makes it easier than ever to choose the right libraries for your development needs.

---

## 🌐 Live Website

👉 **[Visit Librena](https://softlib-1b4db.web.app)**

---

## 🚀 Tech Stack

Librena is built using modern web technologies:

- ⚛️ **React** (with SWC for fast builds)
- ⚡ **Vite** (blazing fast dev environment)
- 💬 **Shadcn-UI** + **Tailwind CSS** (modern and clean UI)
- 🔥 **Firebase** (Authentication, Firestore, Hosting, Functions)
- ☁️ **TypeScript** (robust typing and cleaner code)
- 🍞 **Sonner** (beautiful toast notifications)

---

## 🧠 Features

- 🔍 Explore a curated database of open-source libraries
- 🛠️ Add libraries to personal projects
- 💾 Wishlist functionality with favorites
- 🔁 Library comparison tool
- 🔐 Firebase Authentication (email-based)
- 📥 PDF export of project libraries
- 📱 Mobile-responsive and user-friendly design
- 🎨 Filter, search, and sort libraries by category, stars, date, size, and more

---

## 🛠️ Project Setup (Local Development)

To get started locally, make sure you have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed.

```bash
# Clone the repo
git clone <your_repo_url>
cd <your_project_name>

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🔐 Firebase Deployment

This project is deployed using Firebase Hosting + Functions.

```bash
# Build your project
npm run build

# Deploy to Firebase
firebase deploy
```

Make sure your `firebase.json` and `vite.config.ts` are properly configured. For Firebase Hosting:

```json
"hosting": {
  "public": "dist",
  "rewrites": [
    {
      "source": "**",
      "destination": "/index.html"
    }
  ]
}
```

In `vite.config.ts`:

```ts
base: "./",
```

---

## 📁 Project Structure

```
src/
│
├── components/     # Reusable UI components (Navbar, Footer, Forms)
├── context/        # Authentication context
├── lib/            # Firestore functions and utilities
├── pages/          # Page components (Home, Login, Register, Projects)
├── hooks/          # Custom hooks (e.g., toast system)
├── assets/         # Images and static content
├── App.tsx         # Main App Router
└── main.tsx        # Entry point
```

---

## 📜 License

This project is a **UMBC Graduate Capstone** project submitted by **Pavan Vishnu Varma Namburi** for the MPS in Software Engineering program.

---
## Admin Login Details
Email id : Admin@gmail.com
Password: Admin@123

## 📩 Contact

- Email: [vishnuvarma63012@gmail.com](mailto:vishnuvarma63012@gmail.com)
- Project Website: [https://softlib-1b4db.web.app](https://softlib-1b4db.web.app)

---

## 🤝 Acknowledgements

Special thanks to the faculty and reviewers at UMBC, and to all open-source contributors whose libraries power this project.
