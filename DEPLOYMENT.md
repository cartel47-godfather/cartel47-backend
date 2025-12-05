# CARTEL47 Backend - Railway Deployment Guide

**Option 1: Railway CLI (Fastest & Recommended)**

This is the quickest way to deploy the CARTEL47 backend to Railway. Follow these steps:

## Prerequisites
- Node.js 18+ installed locally
- Git installed
- cloned cartel47-backend repository locally

## Step-by-Step Deployment

### Step 1: Install Railway CLI

Run this command in your terminal:

```bash
curl -fsSL https://railway.com/install.sh | sh
```

On Windows, use:
```bash
iwr https://railway.com/install.ps1 -useb | iex
```

### Step 2: Connect to Railway Project

Run this exact command (copy-paste from Railway dashboard):

```bash
railway link -p ea3f8762-c333-4617-82d5-1d50754168aa
```

This connects your local repository to your Railway project.

### Step 3: Set Environment Variables

Before deploying, set the required environment variables in Railway:

```bash
railway variables set JWT_SECRET="$(openssl rand -hex 32)"
railway variables set NODE_ENV="production"
railway variables set PORT="3000"
railway variables set CORS_ORIGIN="https://cartel47-frontend.vercel.app"
```

> Note: The DATABASE_URL is automatically set by Railway when Postgres is linked.

### Step 4: Deploy to Railway

Now deploy your backend:

```bash
railway up
```

This will:
- Install dependencies (npm install)
- Build the application
- Deploy to Railway
- Show you the deployment URL

### Step 5: Verify Deployment

Once deployed, test the endpoints:

```bash
# Test health check
curl https://your-railway-url.railway.app/health

# Expected response:
# {"status":"ok","env":"production","timestamp":"...","uptime":...}

# Test database connection
curl https://your-railway-url.railway.app/db-check

# Expected response:
# {"database":"connected","users":0,"games":0,"bets":0,"timestamp":"..."}
```

## Complete Commands (Copy-Paste)

Run these commands in sequence:

```bash
# 1. Install Railway CLI
curl -fsSL https://railway.com/install.sh | sh

# 2. Navigate to your backend directory
cd /path/to/cartel47-backend

# 3. Link to Railway project
railway link -p ea3f8762-c333-4617-82d5-1d50754168aa

# 4. Set environment variables
railway variables set JWT_SECRET="$(openssl rand -hex 32)"
railway variables set NODE_ENV="production"
railway variables set PORT="3000"
railway variables set CORS_ORIGIN="https://cartel47-frontend.vercel.app"

# 5. Deploy
railway up
```

## After Deployment

1. **Get Your Backend URL**: Railway will show the URL in the terminal output
   - Format: `https://cartel47-backend-XXXX.railway.app`

2. **Update Frontend**: Set the backend URL in your frontend environment variables:
   - File: `frontend/.env` or `frontend/.env.production`
   - Variable: `VITE_API_URL=https://cartel47-backend-XXXX.railway.app`
   - Redeploy frontend on Vercel

3. **Monitor Logs**: View deployment logs anytime:
   ```bash
   railway logs
   ```

4. **Database Migrations**: Run Prisma migrations if needed:
   ```bash
   railway run npm run migrate
   ```

## Troubleshooting

### "railway command not found"
- Reload your terminal/shell after installation
- Or use full path: `/usr/local/bin/railway`

### "Failed to deploy"
- Check Railway logs: `railway logs`
- Verify all environment variables are set: `railway variables`
- Ensure package.json has valid "start" script

### Database connection error
- Verify DATABASE_URL is set in Railway
- Check PostgreSQL is running in Railway dashboard
- Run: `railway variables` to confirm all variables

### Health check returns error
- Wait 30-60 seconds for deployment to fully start
- Check logs: `railway logs`
- Verify the URL from Railway dashboard

## Deployment Complete!

Once successful, your CARTEL47 backend is live on Railway and connected to:
- ✅ PostgreSQL database (Online)
- ✅ JWT authentication (Active)
- ✅ Express server (Running)
- ✅ CORS configured for frontend

You're now ready for STEP 7: RNG Service & Game Configuration

---

## Alternative: GitHub Integration

If you prefer GitHub integration (slower), see DEPLOYMENT_GITHUB.md
