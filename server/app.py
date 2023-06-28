#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, jsonify, request, session
from flask_restful import Resource

# Local imports
from config import app, db, api, Bcrypt
from models import User, Trip, UserTrip, Destination, TripDestination, Activity, Itinerary

bcrypt = Bcrypt()

# Routes go here!
@app.route( '/' )
def home():
    return '<h1>Welcome to ExploreMate!</h1>'

class ClearSession( Resource ):
    
    def delete( self ):

        session[ 'page_views' ] = None
        session[ 'user_id' ] = None

        return {}, 204

api.add_resource( ClearSession, '/clear', endpoint = 'clear' )
    
class Signup( Resource ):
    
    def post( self ):

        try:
            username = request.get_json()[ 'username' ]
            print(request.get_json())
            email = request.get_json()[ 'email' ]
            password = request.get_json()[ 'password' ]
            first_name = request.get_json()[ 'firstName' ]
            last_name = request.get_json()[ 'lastName' ]

        except KeyError:
            return { "error": "Missing a required field in the form." }, 400
        
        if username and password:
            new_user = User(
                username = username,
                email = email,
                first_name = first_name,
                last_name = last_name
            )
            
            password_hash = bcrypt.generate_password_hash(
                password.encode( 'utf-8' )
            )
            self._password_hash = password_hash.decode( 'utf-8' )
            new_user.password_hash = password
            
            db.session.add( new_user )
            db.session.commit()

            session[ 'user_id' ] = new_user.id
        
            return new_user.u_to_dict(), 201
        else:
            return { "error": "All fields are required." }, 422

api.add_resource( Signup, '/signup', endpoint = 'signup' )

class CheckSession( Resource ):

    def get( self ):
        if session.get( 'user_id' ):
            user = User.query.filter( User.id == session[ 'user_id' ]).first()
            return user.u_to_dict(), 200
        else:
            return {}, 204
        
api.add_resource( CheckSession, '/check_session', endpoint='check_session' )

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
            return user.u_to_dict(), 200
        else:
            return { "error": "Members Only Content, Unauthorized Access!"}, 401

api.add_resource( Login, '/login', endpoint='login' )

class Logout( Resource ):

    def delete( self ):

        session[ 'user_id' ] = None

        return {}, 204
    
api.add_resource( Logout, '/logout', endpoint='logout' )
    
class Users( Resource ):

    def get( self ):
        users = [ user.u_to_dict() for user in User.query.all() ]
        
        return make_response( jsonify( users ), 200 )
    
api.add_resource( Users, '/users', endpoint='users' )
    
class UsersByID( Resource ):

    def get( self, id ):
        user = User.query.filter_by( id=id ).first()

        if user:
            return make_response( jsonify( user.u_to_dict() ), 200 )
        else: 
            return { "error": "User not found." }, 404
        
    def patch( self, id ):
        user = User.query.filter_by( id=id ).first()
        userData = request.get_json()

        if not userData:
            return { "error": "Data required to make a change." }

        if user:
            if 'username' in userData:
                user.username = userData[ 'username' ]
            if 'email' in userData:
                user.email = userData[ 'email' ]
            if 'password' in userData:
                user.password_hash = userData[ 'password' ]
            if 'first_name' in userData:
                user.first_name = userData[ 'first_name' ]
            if 'last_name' in userData:
                user.last_name = userData[ 'last_name' ]
        
            db.session.commit()

            return make_response( jsonify( user.u_to_dict() ), 200 )
        else:
            return {"error": "User not found."}, 404
    
    def delete( self, id ):
        user = User.query.filter_by( id=id ).first()

        if user:
            db.session.delete( user )
            db.session.commit()
            return make_response( "", 204 )
        else: 
            return { "error": "User not found." }, 404

api.add_resource( UsersByID, '/users/<int:id>', endpoint='users_by_id' )
       
class Itineraries( Resource ):

    def get( self ):
        itineraries = [ i.i_to_dict() for i in Itinerary.query.all() ]

        return make_response( jsonify( itineraries ), 200 )

api.add_resource( Itineraries, '/itineraries', endpoint='itineraries' )

class ItinerariesByID( Resource ):

    def get( self, id ):
        itinerary = Itinerary.query.filter_by( id=id ).first()
        
        if itinerary:
            return make_response( jsonify( itinerary.i_to_dict() ), 200 )
        else: 
            return { "error": "Itinerary not found." }, 404

api.add_resource( ItinerariesByID, '/itineraries/<int:id>', endpoint='itineraries_by_id' )

class Trips( Resource ):

    def get( self ):
        trips = [ trip.t_to_dict() for trip in Trip.query.all() ]

        return make_response( jsonify( trips ), 200 )
    
    def post( self ):
        tripData = request.get_json()

        new_trip = Trip(
            name = tripData[ 'name' ],
            start_date = tripData[ 'start_date' ],
            end_date = tripData[ 'end_date' ],
            accommodation = tripData[ 'accommodation' ],
            budget = tripData[ 'budget' ],
            notes = tripData[ 'notes' ],
        )
        
        db.session.add( new_trip )
        db.session.commit()

        return make_response( new_trip.t_to_dict(), 201 )

api.add_resource( Trips, '/trips', endpoint='trips' )
    
class TripsByID( Resource ):

    def get( self, id ):
        trip = Trip.query.filter_by( id=id ).first()
        
        if trip:
            return make_response( jsonify( trip.t_to_dict() ), 200 )
        else: 
            return { "error": "Trip not found." }, 404

    def patch( self, id ):
        trip = Trip.query.filter_by( id=id ).first()
        tripData = request.get_json()

        if not tripData:
            return { "error": "Data required to make a change." }

        if trip:
            if 'name' in tripData:
                trip.name = tripData[ 'name' ]
            if 'start_date' in tripData:
                trip.start_date = tripData[ 'start_date' ]
            if 'end_date' in tripData:
                trip.end_date = tripData[ 'end_date' ]
            if 'accommodation' in tripData:
                trip.accommodation = tripData[ 'accommodation' ]
            if 'budget' in tripData:
                trip.budget = tripData[ 'budget' ]
            if 'notes' in tripData:
                trip.notes = tripData[ 'notes' ]
        
            db.session.commit()

            return make_response( jsonify( trip.t_to_dict() ), 200 )
        else:
            return {"error": "Trip not found."}, 404
        
    def delete( self, id ):
        trip = Trip.query.filter_by( id=id ).first()

        if trip:
            db.session.delete( trip )
            db.session.commit()
            return make_response( "", 204 )
        else: 
            return { "error": "User not found." }, 404

api.add_resource( TripsByID, '/trips/<int:id>', endpoint='trips_by_id' )

class UserTrips( Resource ):
    
    def get( self ):
        user_trips = [ ut.ut_to_dict() for ut in UserTrip.query.all() ]

        return make_response( jsonify( user_trips ), 200 )

api.add_resource( UserTrips, '/user_trips', endpoint='user_trips' )

class UserTripsByID( Resource ):

    def get( self, id ):
        user_trip = UserTrip.query.filter_by( id=id ).first()
        
        if user_trip:
            return make_response( jsonify( user_trip.ut_to_dict() ), 200 )
        else: 
            return { "error": "UserTrip not found." }, 404
        
api.add_resource( UserTripsByID, '/user_trips/<int:id>', endpoint='user_trips_by_id' )

class Destinations( Resource ):

    def get( self ):
        destinations = [ d.d_to_dict() for d in Destination.query.all() ]

        return make_response( jsonify( destinations ), 200 )

    def post( self ):
        destinationData = request.get_json()

        new_destination = Destination(
            name = destinationData[ 'name' ],
            description = destinationData[ 'description' ],
            image_url = destinationData[ 'image_url' ],
        )
        
        db.session.add( new_destination )
        db.session.commit()

        return make_response( new_destination.d_to_dict(), 201 )

api.add_resource( Destinations, '/destinations', endpoint='destinations' )

class DestinationsByID( Resource ):

    def get( self, id ):
        destination = Destination.query.filter_by( id=id ).first()
        
        if destination:
            return make_response( jsonify( destination.d_to_dict() ), 200 )
        else: 
            return { "error": "Destination not found." }, 404

    def patch( self, id ):
        destination = Destination.query.filter_by( id=id ).first()
        destinationData = request.get_json()

        if not destinationData:
            return { "error": "Data required to make a change." }

        if destination:
            if 'name' in destinationData:
                destination.name = destinationData[ 'name' ]
            if 'description' in destinationData:
                destination.description = destinationData[ 'description' ]
            if 'image_url' in destinationData:
                destination.image_url = destinationData[ 'image_url' ]
        
            db.session.commit()

            return make_response( jsonify( destination.d_to_dict() ), 200 )
        else:
            return {"error": "Destination not found."}, 404

    def delete( self, id ):
        destination = Destination.query.filter_by( id=id ).first()

        if destination:
            db.session.delete( destination )
            db.session.commit()
            return make_response( "", 204 )
        else: 
            return { "error": "Destination not found." }, 404
        
api.add_resource( DestinationsByID, '/destinations/<int:id>', endpoint='destinations_by_id' )

class TripDestinations( Resource ):
    
    def get( self ):
        trip_destinations = [ td.td_to_dict() for td in TripDestination.query.all() ]

        return make_response( jsonify( trip_destinations ), 200 )

api.add_resource( TripDestinations, '/trip_destinations', endpoint='trip_destinations' )

class TripDestinationsByID( Resource ):

    def get( self, id ):
        trip_destination = TripDestination.query.filter_by( id=id ).first()
        
        if trip_destination:
            return make_response( jsonify( trip_destination.td_to_dict() ), 200 )
        else: 
            return { "error": "TripDestination not found." }, 404
        
api.add_resource( TripDestinationsByID, '/trip_destinations/<int:id>', endpoint='trip_destinations_by_id' )

class Activities( Resource ):

    def get( self ):
        activities = [ a.a_to_dict() for a in Activity.query.all() ]

        return make_response( jsonify( activities ), 200 )

    def post( self ):
        activityData = request.get_json()

        new_activity = Activity(
            name = activityData[ 'name' ],
            description = activityData[ 'description' ],
            time = activityData[ 'time' ],
            duration = activityData[ 'duration' ],
            location = activityData[ 'location' ],
            notes = activityData[ 'notes' ],
        )
        
        db.session.add( new_activity )
        db.session.commit()

        return make_response( new_activity.a_to_dict(), 201 )

api.add_resource( Activities, '/activities', endpoint='activities' )

class ActivitiesByID( Resource ):

    def get( self, id ):
        activity = Activity.query.filter_by( id=id ).first()
        
        if activity:
            return make_response( jsonify( activity.a_to_dict() ), 200 )
        else: 
            return { "error": "activity not found." }, 404
        
    def patch( self, id ):
        activity = Activity.query.filter_by( id=id ).first()
        activityData = request.get_json()

        if not activityData:
            return { "error": "Data required to make a change." }

        if activity:
            if 'name' in activityData:
                activity.name = activityData[ 'name' ]
            if 'description' in activityData:
                activity.description = activityData[ 'description' ]
            if 'time' in activityData:
                activity.time = activityData[ 'time' ]
            if 'duration' in activityData:
                activity.duration = activityData[ 'duration' ]
            if 'location' in activityData:
                activity.location = activityData[ 'location' ]
            if 'notes' in activityData:
                activity.notes = activityData[ 'notes' ]
            
            db.session.commit()

            return make_response( jsonify( activity.a_to_dict() ), 200 )
        else:
            return {"error": "Activity not found."}, 404
        
    def delete( self, id ):
        activity = Activity.query.filter_by( id=id ).first()

        if activity:
            db.session.delete( activity )
            db.session.commit()
            return make_response( "", 204 )
        else: 
            return { "error": "Activity not found." }, 404
        
api.add_resource( ActivitiesByID, '/activities/<int:id>', endpoint='activities_by_id' )

if __name__ == '__main__':
    app.run(port=5555, debug=True)
