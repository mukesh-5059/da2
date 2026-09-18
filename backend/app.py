from flask import Flask, jsonify
from flask_cors import CORS
from database import init_db

# Import blueprints
from routes.accommodation import accommodation_bp
from routes.personnel import personnel_bp
from routes.mess import mess_bp
from routes.inventory import inventory_bp
from routes.financials import financials_bp
from routes.operations import operations_bp

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

# Register blueprints with api prefix
app.register_blueprint(accommodation_bp, url_prefix='/api')
app.register_blueprint(personnel_bp, url_prefix='/api')
app.register_blueprint(mess_bp, url_prefix='/api')
app.register_blueprint(inventory_bp, url_prefix='/api')
app.register_blueprint(financials_bp, url_prefix='/api')
app.register_blueprint(operations_bp, url_prefix='/api')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Initialize the database upon startup
with app.app_context():
    init_db()

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
