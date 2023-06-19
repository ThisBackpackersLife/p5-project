from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask import abort 

from config import db, Bcrypt

bcrypt = Bcrypt()


# Models go here!
class User( db.Model, SerializerMixin ):
    __tablename__ = 'users' 

    # serialize_rules = ( 'itineraries', 'destinations' )

    id = db.Column( db.Integer, primary_key=True )
    username = db.Column( db.String )
    email = db.Column( db.String, unique = True )
    _password_hash = db.Column( db.String( 30 ) )
    first_name = db.Column( db.String )
    last_name = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_trips = db.relationship( 'UserTrip', back_populates='user' )
    trips = association_proxy( 'user_trips', 'trip', creator=lambda t: UserTrip( trip=t ) )
    
    def user_info( self ):
        return {
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "id": self.id
        }
    
    @hybrid_property
    def password_hash( self ):
        raise Exception( "Password hashes may not be viewed." )
    
    @password_hash.setter
    def password_hash( self, password ):
        password_hash = bcrypt.generate_password_hash(
            password.encode( 'utf-8' )
        )
        self._password_hash = password_hash.decode( 'utf-8' )
    
    def set_password( self, password ):
        self.password_hash = password

    def authenticate( self, password ):
        return Bcrypt.check_password_hash(
            self._password_hash, password.encode( 'utf-8' )
        )

    def __repr__( self ):
        return f'<User { self.first_name }, username:{ self.username } ID:{ self.id }/>'
    
class Itinerary( db.Model, SerializerMixin ):
    __tablename__ = 'itineraries'

    # serialize_rules = ( '-trips.itinerary', '-trips.user', '-trips.user_trips' )

    id = db.Column( db.Integer, primary_key=True )
    weekday = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) )
    activity_id = db.Column( db.Integer, db.ForeignKey( 'activities.id' ) )

    trip = db.relationship( 'Trip', back_populates='itineraries', cascade='all' )
    activity = db.relationship( 'Activity', back_populates='itineraries' )

    def __repr__( self ):
        return f'<Itinerary { self.weekday }, trip_id:{ self.trip_id }, activity_id:{ self.activity_id } />'
    
class Trip( db.Model, SerializerMixin ):
    __tablename__ = 'trips'

    # serialize_rules = ( '-user.trips', '-destination.trips', 'itineraries', '-user_trips.trip', 'user_trips.user' )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    start_date = db.Column( db.Integer )
    end_date = db.Column( db.Integer )
    accommodation = db.Column( db.String )
    budget = db.Column( db.Integer )
    notes = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_trips = db.relationship( 'UserTrip', back_populates="trip" )
    users = association_proxy( 'user_trips', 'user', creator=lambda u: UserTrip( user=u ) )
    trip_destinations = db.relationship( 'TripDestination', back_populates='trip' )
    destinations = association_proxy( 'trip_destinations', 'destination', creator=lambda d: TripDestination( destination=d ) )
    itineraries = db.relationship( 'Itinerary', back_populates='trip', cascade='all', passive_deletes=True )
    activities = association_proxy( 'itineraries', 'activity', creator=lambda a: Activity( activity=a ) )

    def __repr__( self ):
        return f'<Trip { self.name } users:{self.users }, destinations:{ self.destinations } />'
    
class UserTrip( db.Model, SerializerMixin ):
    __tablename__ = 'user_trips'

    # serialize_rules = ( '-trip.user_trips', 'user.trips' )

    id = db.Column( db.Integer, primary_key=True )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_id = db.Column( db.Integer, db.ForeignKey( 'users.id' ) )
    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) )

    user = db.relationship( 'User', back_populates='user_trips' )
    trip = db.relationship( 'Trip', back_populates='user_trips' )

    def __repr__( self ): 
        return f'<UserTrip{ self.id } user_id:{ self.user_id }, trip_id:{ self.trip_id} />'
    
class Destination( db.Model, SerializerMixin ):
    __tablename__ = 'destinations'

    serialize_rules = ( '-trips.destination', '-trips.activity', '-trips.itinerary', '-trips.user', '-trips.user_trips' )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    description = db.Column( db.String )
    image_url = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )
    
    trip_destinations = db.relationship( 'TripDestination', back_populates='destination' )
    trips = association_proxy( 'trip_destinations', 'trip', creator=lambda t: TripDestination( trip=t ) )

    def __repr__( self ):
        return f'<Destination { self.name } />'
    
class TripDestination( db.Model, SerializerMixin ):
    __tablename__ = 'trip_destinations'

    id = db.Column( db.Integer, primary_key=True )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) ) 
    destination_id = db.Column( db.Integer, db.ForeignKey( 'destinations.id' ) )

    trip = db.relationship( 'Trip', back_populates='trip_destinations' )
    destination = db.relationship( 'Destination', back_populates='trip_destinations' )

    def __repr__( self ):
        return f'<TripDestination { self.id } trip_id:{ self.trip_id }, destination_id:{ self.destination_id } />'
    
class Activity( db.Model, SerializerMixin ):
    __tablename__ = 'activities'

    # serialize_rules = ( '-trips.activity', '-trips.itinerary', '-trips.user', '-trips.user_trips' )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    description = db.Column( db.String )
    time = db.Column( db.Integer )
    duration = db.Column( db.Integer )
    location = db.Column( db.String )
    notes = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    itineraries = db.relationship( 'Itinerary', back_populates='activity' )
    trips = association_proxy( 'itineraries', 'trip', creator=lambda t: Itinerary( trip=t ) )

    def __repr__( self ):
        return f'<Activity { self.name } />'

