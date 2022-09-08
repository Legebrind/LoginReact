"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from sqlalchemy.sql import text
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def registro():
    persona = request.get_json()
    user = User.query.filter_by(email = persona.get("email")).first()
    if user:
        raise APIException('El correo ya existe', status_code=404)
    persona = User(
            email = persona.get("email"),
            password = persona["password"],
            is_active = persona["is_active"],
                   )
    db.session.add(persona)
    db.session.commit()
    persona = persona.serialize()
    return jsonify(persona), 200

@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email",None)
    password = request.json.get("password",None)

    user = User.query.filter_by(email=email, password=password).first()
    if user is None:
        return jsonify({"msg" : "Bad username or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token":access_token, "user_id":user.id})

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    return jsonify({"id": user.id, "email": user.email }), 200
