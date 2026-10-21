# BankShield — Secure Banking Operations & Transaction Monitoring

BankShield is a full-stack web application designed to demonstrate secure banking operations, transaction monitoring, risk assessment, and audit logging. It provides a dashboard for monitoring transactions and reviewing flagged activity.

## Features

- **User Authentication:** Registration and login with password hashing and JWT-based authentication.
- **Transaction Monitoring:** View transaction details, risk scores, risk levels, and transaction statuses.
- **Risk Assessment:** Identify and highlight transactions that require additional review.
- **Admin Review:** Allow authorized administrators to review flagged transactions.
- **Audit Logging:** Record authentication and transaction review events for traceability.
- **Dashboard UI:** Responsive interface built with React.js and Material UI.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, Material UI |
| Backend | Python, Flask, Flask-JWT-Extended |
| Database | MongoDB |
| API Communication | Axios, REST API |
| Version Control | Git, GitHub |

## Project Structure

```text
BankShield/
├── backend/
│   └── app.py
├── frontend/
│   └── src/
│       └── App.jsx
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Python 3
- Node.js and npm
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Palak-2008/BankShield.git
cd BankShield
```

### 2. Set up the backend

Open a terminal in the backend directory:

```bash
cd backend
pip install Flask Flask-Cors Flask-JWT-Extended pymongo python-dotenv
python app.py
```

Configure the MongoDB connection and a strong JWT secret using environment variables where required by the application.

### 3. Set up the frontend

Open another terminal in the project directory:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Security Notes

- Passwords should be stored as secure hashes, not plain text.
- Use a strong, private JWT secret and keep environment files out of version control.
- Keep authorization checks on the backend, not just in the frontend.
- Use synthetic data for demonstrations; this project is not connected to a real banking system.

## Future Improvements

- Separate user and administrator dashboards.
- Simulated credit and debit transactions with server-side validation.
- Automated risk scoring and transaction alerts.
- Improved automated tests and deployment documentation.

## Disclaimer

BankShield is an educational portfolio project for demonstrating full-stack development and security concepts. It is not intended for real financial transactions or production banking use.
