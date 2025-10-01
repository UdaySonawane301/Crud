# CRUD Dashboard with Flask & MySQL

A production-ready, animated CRUD dashboard built with **Python Flask**, **MySQL database**, and vanilla **HTML/CSS/JavaScript**. Features an Admin Panel for adding, searching, editing, and deleting entries with smooth animations and a responsive design.

## ✨ Features
- 🏠 **Home page** with typing animation and animated gradient background
- 🎛️ **Admin Panel**: add, search/filter, edit (modal), delete, clear all
- 🗄️ **PostgreSQL database** support with SQLite fallback for local development
- 🚀 **Production-ready** with deployment configurations
- 🔒 **RESTful API** with Flask
- 📱 **Responsive** layout with CSS grid and media queries
- 🎨 **Creative CSS animations** (fade-in, slide-up, bounce, hover effects)

## 🛠️ Tech Stack
- **Backend**: Python 3.11, Flask, Flask-SQLAlchemy, Flask-CORS
- **Database**: PostgreSQL (production) / SQLite (development)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Gunicorn, WSGI

## 📋 Prerequisites
- Python 3.10 or higher
- pip (Python package manager)
- PostgreSQL server (for production) or SQLite (auto-included)

## 🚀 Quick Start

### 1. Clone or Navigate to Project
```bash
cd C:\Users\udays\CascadeProjects\crud-dashboard
```

### 2. Create Virtual Environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment
Create a `.env` file from the example:
```bash
copy .env.example .env  # Windows
# cp .env.example .env  # Linux/Mac
```

**For local development (SQLite):**
```env
FLASK_ENV=development
PORT=5000
# DATABASE_URL not needed - defaults to SQLite
```

**For PostgreSQL:**
```env
FLASK_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/crud_dashboard
```

### 5. Run Application
```bash
python app.py
```

The server will start at **http://localhost:5000**

Open your browser:
- 🏠 Home: http://localhost:5000/
- 🎛️ Admin Panel: http://localhost:5000/admin.html
- ℹ️ About: http://localhost:5000/about.html

## 📁 Project Structure
```
crud-dashboard/
├── app.py                 # Flask application & API routes
├── config.py              # Configuration for different environments
├── wsgi.py                # WSGI entry point for production
├── requirements.txt       # Python dependencies
├── Procfile              # Heroku deployment config
├── runtime.txt           # Python version for hosting
├── .env.example          # Environment variables template
├── index.html            # Home page
├── admin.html            # Admin Panel
├── about.html            # About page
├── styles.css            # Shared styles & animations
├── app.js                # Home page JavaScript
├── admin.js              # Admin Panel CRUD logic
├── README.md             # This file
└── DEPLOYMENT.md         # Detailed deployment guide
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries` | Get all entries (optional `?search=query`) |
| GET | `/api/entries/:id` | Get single entry |
| POST | `/api/entries` | Create new entry |
| PUT | `/api/entries/:id` | Update entry |
| DELETE | `/api/entries/:id` | Delete entry |
| DELETE | `/api/entries` | Delete all entries |
| GET | `/health` | Health check |

## 🗄️ Database

### SQLite (Default for Local Development)
- Automatically created as `crud_dashboard.db`
- No configuration needed
- Perfect for testing

### PostgreSQL (Production)
Set `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://user:password@host:5432/database_name
```

**Schema:**
```sql
CREATE TABLE entries (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT
);
```

Tables are created automatically on first run.

## 🌐 Deployment

This application is ready to deploy to:
- ✅ **Render** (with managed PostgreSQL)
- ✅ **Heroku** (with Heroku Postgres)
- ✅ **Railway** (with built-in PostgreSQL)
- ✅ **PythonAnywhere**
- ✅ **Any VPS** with Python & PostgreSQL

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed deployment instructions for each platform.

### Quick Deploy to Render
```bash
# 1. Push code to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. On Render dashboard:
# - Create PostgreSQL database
# - Create Web Service from GitHub repo
# - Render auto-sets DATABASE_URL
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlite:///crud_dashboard.db` |
| `FLASK_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `SECRET_KEY` | Flask secret key | Auto-generated |

## 🧪 Testing

Run the application locally:
```bash
python app.py
```

Test API endpoints:
```bash
# Get all entries
curl http://localhost:5000/api/entries

# Create entry
curl -X POST http://localhost:5000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"id":"test1","name":"John","email":"john@example.com","role":"Admin","createdAt":1234567890}'
```

## 📝 Notes
- Frontend uses **pure HTML/CSS/JavaScript** (no frameworks)
- Backend uses **Flask** with **SQLAlchemy ORM**
- Database automatically switches between SQLite (dev) and PostgreSQL (prod)
- CORS enabled for API access
- Gunicorn configured for production deployment
- Health check endpoint at `/health` for monitoring

## 🤝 Contributing
Feel free to fork, modify, and use this project for your needs!

## 📄 License
MIT License - feel free to use for personal or commercial projects.

---

**Need help deploying?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step guides!
