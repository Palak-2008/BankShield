# BankShield — Secure Banking Operations & Transaction Monitoring

BankShield is a full-stack web application designed to demonstrate secure banking operations, transaction monitoring, risk assessment, and audit logging. It provides a dashboard for monitoring transactions and reviewing flagged activity.

## Features

- **User Authentication:** Registration and login with password hashing and JWT-based authentication.
- **Transaction Monitoring:** View transaction details, risk scores, risk levels, and transaction statuses.
- **Risk Assessment:** Identify and highlight transactions that require additional review.
- **Admin Review:** Allow authorized administrators to review flagged transactions.
- **Audit Logging:** Record authentication and transaction review events for traceability.
- **Dashboard UI:** Responsive user interface built with React.js and Material UI.

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
│   ├── app.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   ├── package.json
│   └── package-lock.json
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

### 1. Clone the Repository

```bash
git clone https://github.com/Palak-2008/BankShield.git
cd BankShield
```

### 2. Set Up the Backend

Open a terminal in the project directory and navigate to the backend:

```bash
cd backend
```

Install the required Python dependencies:

```bash
pip install -r requirements.txt
```

#### Configure the JWT Secret

BankShield requires the `BANKSHIELD_JWT_SECRET` environment variable to be set before starting the backend.

In PowerShell, generate a secure secret for the current terminal session:

```powershell
$env:BANKSHIELD_JWT_SECRET = python -c "import secrets; print(secrets.token_hex(32))"
```

Keep the generated secret private. If you open a new terminal, you will need to set the variable again unless you configure it through a persistent, secure environment setting.

#### Start the Backend

Make sure MongoDB is running and the database connection settings are correct. Then run:

```bash
python app.py
```

The Flask API should start at:

`http://127.0.0.1:5000`

Keep this terminal open while using the application.

### 3. Set Up the Frontend

Open a **second terminal** in the main `BankShield` project directory.

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

## Security Notes

- Passwords should be stored as secure hashes, not plain text.
- Use a strong, private JWT secret and keep environment files out of version control.
- Enforce authentication and authorization checks on the backend.
- Use synthetic data for demonstrations; this project is not connected to a real banking system.
- Never commit passwords, API keys, or other secrets to GitHub.

## Future Improvements

- Separate user and administrator dashboards.
- Simulated credit and debit transactions with server-side validation.
- Automated risk scoring and transaction alerts.
- Improved automated tests and deployment documentation.

## Disclaimer

BankShield is an educational portfolio project for demonstrating full-stack development and security concepts. It is not intended for real financial transactions or production banking use.
