# Deployment Guide

This guide covers deploying the CRUD Dashboard to various hosting platforms with MySQL database support.

## Table of Contents
- [Local Development](#local-development)
- [Deploy to Heroku](#deploy-to-heroku)
- [Deploy to Railway](#deploy-to-railway)
- [Deploy to Render](#deploy-to-render)
- [Deploy to PythonAnywhere](#deploy-to-pythonanywhere)
- [MySQL Configuration](#mysql-configuration)

---

## Local Development

### 1. Setup Virtual Environment
```bash
cd C:\Users\udays\CascadeProjects\crud-dashboard
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
Create a `.env` file (copy from `.env.example`):
```bash
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

Edit `.env`:
```env
FLASK_ENV=development
PORT=5000
DATABASE_URL=sqlite:///crud_dashboard.db
```

### 4. Run Application
```bash
python app.py
```

Visit: http://localhost:5000

---

## Deploy to Heroku

### Prerequisites
- Heroku account
- Heroku CLI installed

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create your-app-name
```

3. **Add MySQL Database (ClearDB or JawsDB)**
```bash
# Option 1: ClearDB (Free tier available)
heroku addons:create cleardb:ignite

# Option 2: JawsDB (Free tier available)
heroku addons:create jawsdb:kitefin
```

4. **Get Database URL**
```bash
heroku config:get CLEARDB_DATABASE_URL
# or
heroku config:get JAWSDB_URL
```

5. **Set DATABASE_URL**
```bash
heroku config:set DATABASE_URL="mysql+pymysql://username:password@host/database"
```

6. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

7. **Open App**
```bash
heroku open
```

---

## Deploy to Railway

### Steps

1. **Create Account** at [railway.app](https://railway.app)

2. **New Project** → **Deploy from GitHub**

3. **Add MySQL Database**
   - Click "New" → "Database" → "MySQL"
   - Railway will auto-configure `DATABASE_URL`

4. **Configure Environment Variables**
   - Go to your service settings
   - Add variables if needed (Railway auto-sets DATABASE_URL)

5. **Deploy**
   - Railway auto-deploys on git push
   - Get your public URL from the deployment

---

## Deploy to Render

### Steps

1. **Create Account** at [render.com](https://render.com)

2. **New Web Service**
   - Connect your GitHub repository
   - Select Python environment

3. **Configure Service**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn wsgi:app`

4. **Add MySQL Database**
   - Create new MySQL database in Render
   - Copy connection string

5. **Set Environment Variables**
   ```
   DATABASE_URL=mysql+pymysql://user:pass@host/dbname
   FLASK_ENV=production
   ```

6. **Deploy**
   - Render auto-deploys on git push

---

## Deploy to PythonAnywhere

### Steps

1. **Create Account** at [pythonanywhere.com](https://www.pythonanywhere.com)

2. **Upload Code**
   - Use Git or upload files via dashboard
   - Clone repo: `git clone https://github.com/yourusername/crud-dashboard.git`

3. **Create Virtual Environment**
```bash
mkvirtualenv --python=/usr/bin/python3.10 myenv
pip install -r requirements.txt
```

4. **Configure Web App**
   - Go to Web tab → Add a new web app
   - Choose Manual configuration → Python 3.10
   - Set source code directory
   - Edit WSGI file:
   ```python
   import sys
   path = '/home/yourusername/crud-dashboard'
   if path not in sys.path:
       sys.path.append(path)
   
   from app import app as application
   ```

5. **Configure MySQL**
   - Go to Databases tab
   - Initialize MySQL
   - Create database
   - Set DATABASE_URL in .env or environment variables

6. **Reload Web App**

---

## MySQL Configuration

### Connection String Format
```
mysql+pymysql://username:password@host:port/database_name
```

### Example Configurations

**Local MySQL:**
```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/crud_dashboard
```

**Remote MySQL:**
```env
DATABASE_URL=mysql+pymysql://user:pass@mysql.example.com:3306/dbname
```

**With SSL (recommended for production):**
```env
DATABASE_URL=mysql+pymysql://user:pass@host:3306/db?ssl_ca=/path/to/ca.pem
```

### Create Database Manually

If you need to create the database manually:

```sql
CREATE DATABASE crud_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The application will automatically create tables on first run.

---

## Environment Variables Summary

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | Yes |
| `FLASK_ENV` | Environment (development/production) | No |
| `PORT` | Port number (auto-set by most platforms) | No |
| `SECRET_KEY` | Flask secret key (auto-generated if not set) | Recommended |

---

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall/security groups
- Ensure MySQL server is running
- Verify credentials

### Port Issues
- Most platforms auto-assign PORT
- Don't hardcode port in production

### Static Files Not Loading
- Check that `static_folder='.'` is set in Flask app
- Verify file paths in HTML

### CORS Issues
- Flask-CORS is configured for all origins
- Adjust in production if needed

---

## Post-Deployment Checklist

- [ ] Database connection working
- [ ] All pages load correctly
- [ ] CRUD operations functional
- [ ] Search feature working
- [ ] Environment variables set
- [ ] HTTPS enabled (most platforms do this automatically)
- [ ] Error logging configured
- [ ] Backup strategy in place

---

## Support

For issues, check:
- Application logs on your hosting platform
- Database connection logs
- Browser console for frontend errors
