# Quick Start Guide - YouTube Market Intelligence Platform

## 🚀 Get Up and Running in 5 Minutes

### Prerequisites Check
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
```

### Step 1: Install Dependencies
```bash
# Install frontend
npm install

# Install backend
cd server
npm install
cd ..
```

### Step 2: Configure Database
1. Create a NeonDB account at https://neon.tech (free tier available)
2. Create a new project
3. Copy the connection string
4. Create `server/.env` file:
```env
CONNECTION_STRING=postgresql://your-connection-string-here
PORT_NUM=5023
```

### Step 3: Start the Application
```bash
# Terminal 1 - Backend
cd server
node server.js
# Should see: "API listening on http://localhost:5023"

# Terminal 2 - Frontend (new terminal)
npm start
# Should open http://localhost:3000 automatically
```

### Step 4: Explore the Dashboard

Navigate through the tabs:

1. **Overview** - See KPI cards and visualizations
2. **Opportunity Finder** - Filter channels by saturation/revenue
3. **Market Map** - Visual scatter plot of opportunities
4. **Niche Analysis** - Compare niches side-by-side

---

## 🔧 Troubleshooting

### "Cannot connect to database"
- Check your CONNECTION_STRING in `server/.env`
- Ensure NeonDB allows connections (check IP whitelist)
- Verify SSL mode is included: `?sslmode=require`

### "Port 5023 already in use"
- Change PORT_NUM in `server/.env`
- Update proxy in `package.json` to match

### "No data showing in dashboard"
- Verify your database has `channel` and `videos` tables
- Check browser console for API errors
- Ensure backend is running on http://localhost:5023

### CORS errors
- Verify `cors` origin in `server/server.js` matches your frontend URL
- Default is `http://localhost:3000`

---

## 📊 Testing with Sample Data

If you don't have production data yet, the analytics dashboard will:
- Show mock statistics in KPI cards
- Display empty states with helpful messages
- Allow filter interactions (but return no results)

To populate with real data, you'll need to:
1. Run your existing scraping scripts
2. Ensure data populates `channel` and `videos` tables
3. Refresh the dashboard

---

## 🎯 Next Steps

1. **Customize filters** - Adjust default values in OpportunityFinder.js
2. **Add your branding** - Update colors in Analytics.css
3. **Connect production DB** - Point to your full dataset
4. **Deploy** - See DEPLOYMENT.md for hosting options

---

## 📞 Need Help?

- Check README.md for full documentation
- Review API endpoints in server/controller.js
- Inspect Network tab in browser DevTools for API responses
