# Troubleshooting 404 Errors

## Common Causes of 404 Errors

### 1. API Endpoint Not Running
**Symptom:** 404 on `/api/menu` or other API endpoints

**Solution:**
- Make sure your backend server is running:
  ```bash
  cd server
  npm run dev
  ```
- Check it's running on port 5001 (or whatever PORT you set in .env)
- Verify: Visit `http://localhost:5001/api/health` in browser - should see JSON response

### 2. Proxy Not Configured
**Symptom:** Frontend can't reach backend API

**Check:** `strawb/package.json` should have:
```json
"proxy": "http://localhost:5001"
```

**Fix:** If missing or wrong port, update it and restart React dev server

### 3. Images Not Found
**Symptom:** 404 on `/images/cake.png` etc.

**Check:**
- Images should be in `strawb/public/images/` folder
- Verify files exist:
  ```bash
  dir strawb\public\images
  ```

**Common Issues:**
- Images in wrong location (`src/images/` instead of `public/images/`)
- Wrong path in database (should be `/images/cake.png` not `images/cake.png`)
- React dev server needs restart after adding images to `public/`

### 4. Database Has Wrong Image Paths
**Symptom:** Images exist but paths don't match

**Solution:** Re-seed the database:
```bash
cd server
npm run seed
```

This will update all menu items with correct image paths: `/images/cake.png`, `/images/threecake.png`, etc.

### 5. React Dev Server Cache
**Symptom:** Changes not showing up

**Solution:**
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Restart React dev server

## Step-by-Step Debugging

### Step 1: Check Backend API
```bash
# Terminal 1 - Start backend
cd server
npm run dev
```

Should see:
```
Connected to MongoDB
API server listening on port 5001
```

### Step 2: Test API Directly
Open browser: `http://localhost:5001/api/menu`

Should see JSON with menu items like:
```json
[
  {
    "_id": "...",
    "name": "Strawbeary Jam",
    "imageURL": "/images/cake.png",
    ...
  }
]
```

### Step 3: Check Frontend Proxy
In `strawb/package.json`, verify:
```json
"proxy": "http://localhost:5001"
```

### Step 4: Check Images Exist
```bash
dir strawb\public\images
```

Should see:
- cake.png
- cakeslice.webp
- drink.png
- drink2.webp
- latte.webp
- threecake.png

### Step 5: Check Browser Console
Open browser DevTools (F12) → Console tab

Look for:
- `GET http://localhost:3000/api/menu 404` → Backend not running or proxy issue
- `GET http://localhost:3000/images/cake.png 404` → Image file missing or wrong path
- `Failed to load menu` → API connection issue

### Step 6: Verify Database Paths
If images still 404, check what's in database:
- Re-seed: `npm run seed` in server folder
- Or check MongoDB directly - imageURL should start with `/images/`

## Quick Fix Checklist

- [ ] Backend server running on port 5001
- [ ] `strawb/package.json` has correct proxy: `"proxy": "http://localhost:5001"`
- [ ] Images exist in `strawb/public/images/`
- [ ] Database seeded with correct paths (`/images/...`)
- [ ] React dev server restarted after changes
- [ ] Browser hard refreshed (Ctrl+Shift+R)

## Still Not Working?

Check the exact 404 error in browser console:
1. What URL is returning 404?
2. Is it `/api/menu` or `/images/...`?
3. What's the full error message?

This will help pinpoint the exact issue!

