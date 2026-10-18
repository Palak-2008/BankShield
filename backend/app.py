
import os
from datetime import datetime, timezone
from functools import wraps

from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    get_jwt_identity,
    jwt_required,
)
from pymongo import MongoClient
from pymongo.errors import PyMongoError
from werkzeug.security import generate_password_hash, check_password_hash


# --------------------------------------------------
# 1. FLASK CONFIGURATION
# --------------------------------------------------

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.environ.get(
    "BANKSHIELD_JWT_SECRET",
    "development-only-change-this-secret-before-deployment",
)
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 60 * 60  # 1 hour

jwt = JWTManager(app)


# --------------------------------------------------
# 2. CORS CONFIGURATION
# Allows the Vite frontend on localhost ports
# such as 5173, 5174 and 5175.
# --------------------------------------------------

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                r"http://localhost:\d+",
                r"http://127\.0\.0\.1:\d+",
            ]
        }
    },
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    supports_credentials=False,
    max_age=600,
)


# --------------------------------------------------
# 3. MONGODB CONNECTION
# --------------------------------------------------

MONGO_URI = os.environ.get(
    "MONGO_URI",
    "mongodb://127.0.0.1:27017",
)

client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["BankShield"]

users_collection = db["users"]
transactions_collection = db["transactions"]
audit_collection = db["audit_logs"]


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def write_audit(username, action, details=""):
    """Save an audit event without exposing passwords or tokens."""
    try:
        audit_collection.insert_one(
            {
                "username": username,
                "action": action,
                "details": details,
                "timestamp": utc_now(),
            }
        )
    except PyMongoError:
        app.logger.exception("Could not save audit event")


# --------------------------------------------------
# 4. ERROR HANDLING
# --------------------------------------------------

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"message": "Invalid request"}), 400


@app.errorhandler(404)
def not_found(error):
    return jsonify({"message": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(error):
    app.logger.exception("Internal server error")
    return jsonify({"message": "Internal server error"}), 500


# --------------------------------------------------
# 5. API HEALTH CHECK
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "message": "BankShield API is running",
            "status": "running",
        }
    ), 200


@app.route("/api/health", methods=["GET"])
def health():
    try:
        client.admin.command("ping")
        return jsonify(
            {
                "status": "healthy",
                "database": "connected",
            }
        ), 200
    except PyMongoError:
        return jsonify(
            {
                "status": "error",
                "database": "disconnected",
            }
        ), 503


# --------------------------------------------------
# 6. REGISTER
# POST /api/auth/register
# --------------------------------------------------

@app.route("/api/auth/register", methods=["POST", "OPTIONS"])
def register():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json(silent=True) or {}

        username = str(data.get("username", "")).strip()
        password = data.get("password", "")

        if not username or not isinstance(password, str):
            return jsonify(
                {"message": "Username and password are required"}
            ), 400

        if len(username) < 3:
            return jsonify(
                {"message": "Username must contain at least 3 characters"}
            ), 400

        if len(password) < 8:
            return jsonify(
                {"message": "Password must contain at least 8 characters"}
            ), 400

        existing_user = users_collection.find_one(
            {"username": username},
            {"_id": 1},
        )

        if existing_user:
            return jsonify(
                {"message": "Username already exists"}
            ), 409

        user_document = {
            "username": username,
            "password_hash": generate_password_hash(password),
            "created_at": utc_now(),
            "role": "user",
        }

        users_collection.insert_one(user_document)

        write_audit(username, "REGISTER", "Account created")

        return jsonify(
            {
                "message": "Account created successfully",
                "username": username,
            }
        ), 201

    except PyMongoError:
        app.logger.exception("Registration database error")
        return jsonify(
            {"message": "Database error during registration"}
        ), 500
    except Exception:
        app.logger.exception("Registration error")
        return jsonify(
            {"message": "Registration failed"}
        ), 500


# --------------------------------------------------
# 7. LOGIN
# POST /api/auth/login
# --------------------------------------------------

@app.route("/api/auth/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json(silent=True) or {}

        username = str(data.get("username", "")).strip()
        password = data.get("password", "")

        if not username or not isinstance(password, str) or not password:
            return jsonify(
                {"message": "Username and password are required"}
            ), 400

        user = users_collection.find_one({"username": username})

        if not user or not check_password_hash(
            user.get("password_hash", ""),
            password,
        ):
            return jsonify(
                {"message": "Invalid username or password"}
            ), 401

        access_token = create_access_token(
            identity=username,
            additional_claims={"role": user.get("role", "user")},
        )

        write_audit(username, "LOGIN", "Successful login")

        return jsonify(
            {
                "message": "Login successful",
                "access_token": access_token,
                "token": access_token,
                "username": username,
                "role": user.get("role", "user"),
                "user": {
                    "username": username,
                    "role": user.get("role", "user"),
                },
            }
        ), 200

    except PyMongoError:
        app.logger.exception("Login database error")
        return jsonify(
            {"message": "Database error during login"}
        ), 500
    except Exception:
        app.logger.exception("Login error")
        return jsonify(
            {"message": "Login failed"}
        ), 500


# --------------------------------------------------
# 8. CURRENT USER
# GET /api/auth/me
# --------------------------------------------------

@app.route("/api/auth/me", methods=["GET"])
@jwt_required()
def current_user():
    username = get_jwt_identity()
    user = users_collection.find_one(
        {"username": username},
        {"_id": 0, "username": 1, "role": 1, "created_at": 1},
    )

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"user": user, **user}), 200


# --------------------------------------------------
# 9. TRANSACTIONS
# GET /api/transactions
# --------------------------------------------------

@app.route("/api/transactions", methods=["GET"])
@jwt_required()
def get_transactions():
    try:
        transactions = list(
            transactions_collection.find(
                {},
                {"_id": 0},
            ).sort("_id", -1).limit(200)
        )

        return jsonify({"transactions": transactions}), 200

    except PyMongoError:
        app.logger.exception("Could not load transactions")
        return jsonify(
            {"message": "Could not load transactions"}
        ), 500


# --------------------------------------------------
# 10. RISK SUMMARY
# GET /api/risk
# --------------------------------------------------

@app.route("/api/risk", methods=["GET"])
@jwt_required()
def get_risk_summary():
    try:
        total = transactions_collection.count_documents({})
        flagged = transactions_collection.count_documents(
            {"status": {"$in": ["flagged", "review", "high-risk"]}}
        )

        return jsonify(
            {
                "total_transactions": total,
                "flagged_transactions": flagged,
                "normal_transactions": max(total - flagged, 0),
                "risk_rate": round((flagged / total) * 100, 2)
                if total else 0,
            }
        ), 200

    except PyMongoError:
        app.logger.exception("Could not calculate risk summary")
        return jsonify(
            {"message": "Could not calculate risk summary"}
        ), 500


# --------------------------------------------------
# 11. REVIEW A TRANSACTION
# PUT /api/transactions/<transaction_id>/review
# --------------------------------------------------

@app.route(
    "/api/transactions/<transaction_id>/review",
    methods=["PUT", "OPTIONS"],
)
@jwt_required()
def review_transaction(transaction_id):
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json(silent=True) or {}
        status = str(data.get("status", "reviewed")).strip().lower()

        allowed_statuses = {"reviewed", "approved", "rejected"}

        if status not in allowed_statuses:
            return jsonify(
                {
                    "message": (
                        "Status must be reviewed, approved, or rejected"
                    )
                }
            ), 400

        # Supports transactions identified by either a MongoDB ID
        # or a custom transaction_id field.
        from bson import ObjectId
        from bson.errors import InvalidId

        conditions = [{"transaction_id": transaction_id}]

        try:
            conditions.append({"_id": ObjectId(transaction_id)})
        except (InvalidId, TypeError):
            pass

        transaction = transactions_collection.find_one(
            {"$or": conditions}
        )

        if not transaction:
            return jsonify(
                {"message": "Transaction not found"}
            ), 404

        result = transactions_collection.update_one(
            {"_id": transaction["_id"]},
            {
                "$set": {
                    "status": status,
                    "reviewed_by": get_jwt_identity(),
                    "reviewed_at": utc_now(),
                }
            },
        )

        if result.matched_count == 0:
            return jsonify(
                {"message": "Transaction was not updated"}
            ), 404

        write_audit(
            get_jwt_identity(),
            "TRANSACTION_REVIEW",
            f"Transaction {transaction_id}: {status}",
        )

        return jsonify(
            {
                "message": "Transaction review updated",
                "transaction_id": transaction_id,
                "status": status,
            }
        ), 200

    except PyMongoError:
        app.logger.exception("Transaction review database error")
        return jsonify(
            {"message": "Could not update transaction review"}
        ), 500


# --------------------------------------------------
# 12. AUDIT LOGS
# GET /api/audit-logs
# --------------------------------------------------

@app.route("/api/audit-logs", methods=["GET"])
@jwt_required()
def get_audit_logs():
    try:
        logs = list(
            audit_collection.find(
                {},
                {"_id": 0},
            ).sort("_id", -1).limit(200)
        )

        return jsonify({"audit_logs": logs, "logs": logs}), 200

    except PyMongoError:
        app.logger.exception("Could not load audit logs")
        return jsonify(
            {"message": "Could not load audit logs"}
        ), 500


# --------------------------------------------------
# 13. START SERVER
# --------------------------------------------------

if __name__ == "__main__":
    try:
        client.admin.command("ping")
        print("MongoDB connected: BankShield database ready.")
    except PyMongoError:
        print("WARNING: MongoDB is not reachable.")
        print("Start MongoDB before using registration or login.")

    print("BankShield API starting on http://127.0.0.1:5000")
    print("CORS configured for local React/Vite development ports.")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )
