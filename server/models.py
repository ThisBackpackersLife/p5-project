from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from flask import abort 

from config import db


# Models go here!
class User( db.Model, SerializerMixin ):
    __tablename__ = 'users' 

    serialize_rules = ( 'itineraries', 'destinations' )

    id = db.Column( db.Integer, primary_key=True )
    username = db.Column( db.String )
    email = db.Column( db.String, unique = True )
    _password_hash = db.Column( db.String( 30 ) )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trips = db.relationship( 'Trip', backref = 'user')
    destinations = association_proxy( 'destinations', 'destination' )
    itineraries = db.relationship( 'Itinerary', backref = 'user' )
    activities = db.relationship( 'Activity', secondary = 'itineraries', backref = 'users' )
    user_trips = db.relationship( 'UserTrip', backref = 'user' )

    def __repr__( self ):
        return f'<User { self.username }, ID: { self.id }'
    
class Trip( db.Model, SerializerMixin ):
    __tablename__ = 'trips'

    serialize_rules = ( '-user.trips', '-destination.trips', '-activity.trips', 'itineraries', '-user_trips.trip', 'user_trips.user' )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    start_date = db.Column( db.Integer )
    end_date = db.Column( db.Integer )
    accommodation = db.Column( db.String )
    budget = db.Column( db.Integer )
    notes = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_id = db.Column( db.Integer, db.ForeignKey( 'users.id' ) )
    user_trips_id = db.Column( db.Integer, db.ForeignKey( 'user_trips.id'))
    # destination_id = db.Column( db.Integer, db.ForeignKey( 'destinations.id' ) )
    # itinerary_id = db.Column( db.Integer, db.ForeignKey( 'itineraries.id' ) )

    user = db.relationship( 'User', backref = 'trips' )
    destinations = association_proxy( 'trip_destinations', 'destination' )
    itineraries = db.relationship( 'Itinerary', backref = 'trip' )
    user_trips = db.relationship( 'UserTrip', backref = 'trip' )
    activities = db.relationship( 'Activity', secondary = 'itineraries', backref = 'trips' )

    def __repr__( self ):
        return f'<Trip { self.name }, user_id:{ self.user_id }, user_trips_id:{ self.user_trips_id }, destination_id:{ self.destination_id }, activity_id:{ self.activity_id }, itinerary_id:{ self.itinerary_id }'
    
class UserTrip( db.Model, SerializerMixin ):
    __tablename__ = 'user_trips'

    serialize_rules = ( '-trip.user_trips', 'user.trips' )

    id = db.Column( db.Integer, primary_key=True )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_id = db.Column( db.Integer, db.ForeignKey( 'users.id' ) )
    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) )

    user = db.relationship( 'User', backref = 'user_trips' )
    trip = db.relationship('Trip', backref='user_trips')

    def __repr__( self ): 
        return f'<UserTrip{ self.id } user_id:{ self.user_id }, trip_id:{ self.trip_id}'
    
class Destination( db.Model, SerializerMixin ):
    __tablename__ = 'destinations'

    serialize_rules = ( '-trips.destination', '-trips.activity', '-trips.itinerary', '-trips.user', '-trips.user_trips' )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    description = db.Column( db.String )
    image_url = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trips = association_proxy( 'trip_destinations', 'trip' )
    activities = db.relationship( 'Activity', secondary = 'itineraries', backref = 'destination' )

    def __repr__( self ):
        return f'<Destination { self.name }, trip_id:{ self.trip_id }'
    
class TripDestination( db.Model, SerializerMixin ):
    __tablename__ = 'trip_destinations'

    id = db.Column( db.Integer, primary_key=True )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) ) 
    destination_id = db.Column( db.Integer, db.ForeignKey( 'destinations.id' ) )

    def __repr__( self ):
        return f'<TripDestination { self.id } trip_id:{ self.trip_id }, destination_id:{ self.destination_id }'
    
class Itinerary( db.Model, SerializerMixin ):
    __tablename__ = 'itineraries'

    serialize_rules = ( '-trips.itinerary', '-trips.user', '-trips.user_trips' )

    id = db.Column( db.Integer, primary_key=True )
    weekday = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_id = db.Column( db.Integer, db.ForeignKey( 'users.id' ) )
    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) )
    activity_id = db.Column( db.Integer, db.ForeignKey( 'activities.id' ) )

    activities = db.relationship( 'Activity', backref = 'itinerary' )
    trip = db.relationship( 'Trip', backref = 'itineraries' )

    def __repr__( self ):
        return f'<Itinerary { self.weekday }, user_id:{self.user_id}, trip_id:{ self.trip_id }, activity_id:{ self.activity_id }'
    
class Activity( db.Model, SerializerMixin ):
    __tablename__ = 'activities'

    serialize_rules = ( '-trips.activity', '-trips.itinerary', '-trips.user', '-trips.user_trips' )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    description = db.Column( db.String )
    time = db.Column( db.Integer )
    duration = db.Column( db.Integer )
    location = db.Column( db.String )
    notes = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) )
    itinerary_id = db.Column( db.Integer, db.ForeignKey( 'itineraries.id' ) )
    user_id = db.Column( db.Integer, db.ForeignKey( 'users.id' ) )

    trip = db.relationship( 'Trip', backref = 'activities' )
    itinerary = db.relationship( 'Itinerary', backref = 'activities' )
    trips = association_proxy( 'Trip', 'activity' )
    users = db.relationship( 'User', secondary = 'itineraries', backref = 'activities' )
    destinations = db.relationship('Destination', secondary='itineraries', backref='activities')

    def __repr__( self ):
        return f'<Activity { self.name }, trip_id:{ self.trip_id }, itinerary_id:{ self.itinerary_id }'

