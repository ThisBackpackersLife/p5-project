#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, jsonify, request, session
from flask_restful import Resource

# Local imports
from config import app, db, api, Bcrypt
from models import User, Trip, UserTrip, Destination, TripDestination, Activity, Itinerary
# Views go here!

@app.route('/')
def home():
    return '<h1>Welcome to ExploreMate!</h1>'

class ClearSession( Resource ):
    
    def delete( self ):

        session[ 'page_views' ] = None
        session[ 'user_id' ] = None

        return {}, 204
    
class Signup( Resource ):
    
    def post( self ):

        try:
            username = request.get_json()[ 'username' ]
            email = request.get_json()[ 'email' ]
            password = request.get_json()[ 'password' ]
        except KeyError:
            return { "error": "Missing a required field in the form." }, 400
        
        if username and password:
            new_user = User(
                username = username,
                email = email
            )
            new_user.password_hash = password
            db.session.add( new_user )
            db.session.commit()

            session[ 'user_id' ] = new_user.id
        
            return user_to_dict( new_user ), 201
        else:
            return { "error": "Unprocessable Entity" }, 422
        
class CheckSession( Resource ):

    def get( self ):
        if session.get( 'user_id' ):
            user = User.query.filter( User.id == session[ 'user_id' ]).first()
            return user_to_dict( user ), 200
        else:
            return {}, 204
        
class Login( Resource ):

    def post( self ):
        try:
            username = request.get_json()[ 'username' ]
            password = request.get_json()[ 'password' ]
        except TypeError:
            return { "error": "Missing 'username' or 'password'." }, 400
        
        user = User.query.filter( User.username == username ).first()

        if user.authenticate( password ):
            session[ 'user_id' ] = user.id
            return user_to_dict( user ), 200
        else:
            return { "error": "Members Only Content, Unauthorized Access!"}, 401
        
class Logout( Resource ):

    def delete( self ):

        session[ 'user_id' ] = None

        return {}, 204

api.add_resource( ClearSession, '/clear', endpoint = 'clear' )
api.add_resource( Signup, '/signup', endpoint = 'signup' )
api.add_resource( CheckSession, '/check_session', endpoint='check_session' )
api.add_resource( Login, '/login', endpoint='login' )
api.add_resource( Logout, '/logout', endpoint='logout' )

def user_to_dict( user ):
    return {
        "id": user.id,
        "username": user.username,
        "_password_hash": user._password_hash,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name
    }

if __name__ == '__main__':
    app.run(port=5555, debug=True)
