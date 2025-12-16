# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**This is the easiest option - no installation needed!**

### Step 1: Create a Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (it's free!)
3. Choose the **FREE** tier (M0 Sandbox)

### Step 2: Create a Cluster
1. Choose a cloud provider (AWS, Google Cloud, or Azure) - any is fine
2. Choose a region closest to you
3. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Set Up Database Access
1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter a username (e.g., `strawbeary-admin`)
5. Enter a password (save this somewhere safe!)
6. Under "Database User Privileges", select "Atlas admin" or "Read and write to any database"
7. Click "Add User"

### Step 4: Set Up Network Access
1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development - shows `0.0.0.0/0`)
4. Click "Confirm"

### Step 5: Get Your Connection String
1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string - it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add a database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/strawbeary?retryWrites=true&w=majority`

### Step 6: Update Your .env File
In your `server/.env` file, paste your connection string:

```env
MONGODB_URI=mongodb+srv://strawbeary-admin:yourpassword@cluster0.xxxxx.mongodb.net/strawbeary?retryWrites=true&w=majority
PORT=5000
```

**Important:** Replace `yourpassword` with your actual password!

### Step 7: Test the Connection
```bash
npm run seed
```

You should see:
```
✅ Seeded 6 menu items...
✅ Database seeding completed!
```

---

## Option 2: Local MongoDB Installation

If you prefer to run MongoDB locally on your computer:

### Windows:
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. During installation, check "Install MongoDB as a Service"
4. MongoDB will start automatically

### Mac:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Verify Local MongoDB is Running:
```bash
# Windows: Check Services
# Mac/Linux:
mongod --version
```

### Update .env for Local MongoDB:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/strawbeary
PORT=5000
```

---

## Troubleshooting

**"Authentication failed"**
- Double-check your username and password in the connection string
- Make sure there are no special characters that need URL encoding

**"IP not whitelisted"**
- Go to MongoDB Atlas → Network Access
- Make sure `0.0.0.0/0` is added (or your current IP)

**"Connection timeout"**
- Check your internet connection
- Verify the connection string is correct
- Make sure MongoDB Atlas cluster is running (check the dashboard)

**Still having issues?**
- Try the connection string from MongoDB Atlas Compass (desktop app)
- Or use the connection string format from the Atlas dashboard

