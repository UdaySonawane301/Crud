from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app)

# Database configuration
# Supports PostgreSQL, MySQL, and SQLite (fallback for local development)
DATABASE_URL = os.getenv('DATABASE_URL')

if DATABASE_URL:
    # Handle Render's postgres:// URL (needs to be postgresql://)
    if DATABASE_URL.startswith('postgres://'):
        DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    # SQLite fallback for local development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///crud_dashboard.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_pre_ping': True,
    'pool_recycle': 300,
}

db = SQLAlchemy(app)

# Entry Model
class Entry(db.Model):
    __tablename__ = 'entries'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.BigInteger, nullable=False)
    updated_at = db.Column(db.BigInteger, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'createdAt': self.created_at,
            'updatedAt': self.updated_at
        }

# Create tables
with app.app_context():
    db.create_all()
    print("Database tables created successfully!")

# Routes for serving static files
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# API Routes

@app.route('/api/entries', methods=['GET'])
def get_entries():
    """Get all entries with optional search"""
    try:
        search_query = request.args.get('search', '').strip()
        
        if search_query:
            # Search in name, email, or role
            entries = Entry.query.filter(
                db.or_(
                    Entry.name.ilike(f'%{search_query}%'),
                    Entry.email.ilike(f'%{search_query}%'),
                    Entry.role.ilike(f'%{search_query}%')
                )
            ).order_by(Entry.created_at.desc()).all()
        else:
            entries = Entry.query.order_by(Entry.created_at.desc()).all()
        
        return jsonify([entry.to_dict() for entry in entries]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries/<entry_id>', methods=['GET'])
def get_entry(entry_id):
    """Get single entry by ID"""
    try:
        entry = Entry.query.get(entry_id)
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        return jsonify(entry.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries', methods=['POST'])
def create_entry():
    """Create new entry"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['id', 'name', 'email', 'role']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Create new entry
        entry = Entry(
            id=data['id'],
            name=data['name'],
            email=data['email'],
            role=data['role'],
            created_at=data.get('createdAt', int(datetime.now().timestamp() * 1000))
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify(entry.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries/<entry_id>', methods=['PUT'])
def update_entry(entry_id):
    """Update existing entry"""
    try:
        entry = Entry.query.get(entry_id)
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if not all(key in data for key in ['name', 'email', 'role']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Update entry
        entry.name = data['name']
        entry.email = data['email']
        entry.role = data['role']
        entry.updated_at = int(datetime.now().timestamp() * 1000)
        
        db.session.commit()
        
        return jsonify(entry.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries/<entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    """Delete single entry"""
    try:
        entry = Entry.query.get(entry_id)
        if not entry:
            return jsonify({'error': 'Entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Entry deleted', 'id': entry_id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/entries', methods=['DELETE'])
def delete_all_entries():
    """Delete all entries"""
    try:
        count = Entry.query.delete()
        db.session.commit()
        
        return jsonify({'message': 'All entries deleted', 'count': count}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Health check endpoint for hosting platforms
@app.route('/health')
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.getenv('FLASK_ENV') == 'development')
