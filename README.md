# Express.js TypeScript Payment & Subscription API

A modern, containerized backend API for simulating payment routing and recurring subscription billing, built with Express.js and TypeScript.

## 🚀 Features
- **TypeScript**: Strict, modern codebase
- **Express.js**: Fast, modular API
- **Joi**: Request validation middleware
- **LLM Simulation**: Campaign tagging and summarization
- **In-memory Storage**: For transactions and subscriptions
- **Recurring Billing**: Simulated with background jobs
- **Comprehensive Tests**: Jest + Supertest
- **Dockerized**: Easy to run anywhere

## 📦 Project Structure
```
src/
  controllers/         # HTTP controllers
  middleware/          # Express middleware
  routes/              # API route definitions
  services/            # Business logic
  types/               # TypeScript types/interfaces
  utils/               # Utility helpers
  validation/          # Joi schemas
  __tests__/           # Jest/Supertest tests
```

## 🐳 Running with Docker Compose

### 1. Build and start the app
```bash
docker-compose up --build
```
- The API will be available at [http://localhost:3000](http://localhost:3000)

### 2. Environment Variables
- The container uses `env.example` for configuration (see file for options).

### 3. Stopping the app
```bash
docker-compose down
```

## 🧪 Running Tests (Locally)
```bash
npm install
npm test
```

## 🛠️ API Endpoints

### Payment Gateway Proxy
- `POST /api/payments/charge` — Simulate a payment (routes to Stripe/PayPal or blocks based on risk)
- `GET /api/payments/transactions` — List all payment transactions

### Subscription Billing Simulator
- `POST /api/subscriptions` — Create a recurring donation subscription
- `DELETE /api/subscriptions/:donorId` — Cancel a subscription
- `GET /api/subscriptions` — List all active subscriptions
- `GET /api/subscriptions/charges` — List all recurring charges

## 📝 Example Requests

**Create a Payment:**
```bash
curl -X POST http://localhost:3000/api/payments/charge \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "currency": "USD", "source": "tok_test", "email": "donor@example.com"}'
```

**Create a Subscription:**
```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1500,
    "currency": "USD",
    "source": "tok_test",
    "email": "donor@example.com",
    "campaignDescription": "Disaster relief for Nepal. Help children and families.",
    "interval": "daily"
  }'
```

**Cancel a Subscription:**
```bash
curl -X DELETE http://localhost:3000/api/subscriptions/<donorId>
```

## 🧑‍💻 Assignment Evaluation Checklist
- [x] TypeScript, modular structure, and separation of concerns
- [x] Payment routing with risk scoring and LLM explanation
- [x] Subscription creation, cancellation, and recurring billing
- [x] LLM campaign tagging and summarization (simulated)
- [x] Joi validation middleware
- [x] In-memory storage for all data
- [x] All endpoints tested with Jest + Supertest
- [x] Dockerfile & docker-compose for containerization
- [x] README with clear instructions

## ℹ️ Notes
- This project is for simulation/demo purposes only (no real payment processing).
- All data is stored in memory and will reset when the server restarts.
- The LLM service is mocked for assignment purposes.

---
**Happy Coding!** 🎉