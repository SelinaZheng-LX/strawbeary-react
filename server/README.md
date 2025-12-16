# Strawbeary Backend API

Node.js + Express + MongoDB backend for the Strawbeary Cafe application.

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Install MongoDB locally: https://www.mongodb.com/try/download/community
- Start MongoDB service
- Default connection: `mongodb://127.0.0.1:27017/strawbeary`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/strawbeary`
- Replace username/password with your credentials

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cp .env.example .env
```

Edit `.env` and set your `MONGODB_URI`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/strawbeary
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/strawbeary
PORT=5000
```

### 4. Seed the Database

Populate the database with initial menu items:

```bash
npm run seed
```

You should see:
```
✅ Seeded 6 menu items:
   - Strawbeary Jam ($5.99)
   - Strawbeary Delight ($6.49)
   ...
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add a new menu item (admin)

### Cart
- `GET /api/cart/:sessionId` - Get cart for a session
- `POST /api/cart` - Update/save cart for a session

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:sessionId` - Get orders for a session

## Testing the API

You can test endpoints using:

**Browser:**
- Visit: `http://localhost:5000/api/health`
- Visit: `http://localhost:5000/api/menu`

**Command Line (curl):**
```bash
curl http://localhost:5000/api/health
curl http://localhost:5000/api/menu
```

**Postman/Insomnia:**
- Import the endpoints above and test them

## Troubleshooting

**"Cannot connect to MongoDB"**
- Make sure MongoDB is running (if using local)
- Check your `MONGODB_URI` in `.env` is correct
- For Atlas, ensure your IP is whitelisted in Network Access

**"Port 5000 already in use"**
- Change `PORT` in `.env` to a different number (e.g., 5001)
- Or stop the process using port 5000

