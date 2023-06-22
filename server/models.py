from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask import abort
from sqlalchemy import Date
from datetime import datetime, date


from config import db, Bcrypt

bcrypt = Bcrypt()


# Models go here!
class User( db.Model, SerializerMixin ):
    __tablename__ = 'users' 

    # serialize_rules = ( '-user_trips.user', '-trips.users', )

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
    
    def __repr__( self ):
        return f'<User { self.first_name }, username:{ self.username } ID:{ self.id }/>'
    
    def u_to_dict( self ):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "trips": [ trip.t_to_dict() for trip in self.trips ]
        }
    
    @hybrid_property
    def password_hash( self ):
        raise Exception( "Password hashes may not be viewed." )
    
    @password_hash.setter
    def password_hash( self, password ):
        if type( password ) is str and 5 <= len( password ) <= 30 and password: 
            password_hash = bcrypt.generate_password_hash(
                password.encode( 'utf-8' )
            )
            self._password_hash = password_hash.decode( 'utf-8' )
        else:
            abort( 422, "Password must be a string between 5 and 30 characters." )
    
    def set_password( self, password ):
        self.password_hash = password

    def authenticate( self, password ):
        return Bcrypt.check_password_hash(
            self._password_hash, password.encode( 'utf-8' )
        )
    
    @validates( 'username' )
    def validate_username( self, key, username ):
        user = User.query.filter( User.username.like( f'%{ username }%' ) ).first()
        if isinstance( username, str ) and username and user == None:
            return username
        else:
            abort( 422, "Username must be a unique string." )

    @validates( 'email' )
    def validate_email( self, key, email ):
        user = User.query.filter( User.email.like( f'%{ email }%' ) ).first()
        if isinstance( email, str ) and email and user == None:
            return email
        else:
            abort( 422, "Email must be a unique string." ) 

    @validates( 'first_name' )
    def validate_first_name( self, key, first_name ):
        if isinstance( first_name, str ) and first_name:
            return first_name
        else:
            abort( 422, "Name must be a string." )

    @validates( 'last_name' )
    def validate_last_name( self, key, last_name ):
        if isinstance( last_name, str ) and last_name:
            return last_name
        else:
            abort( 422, "Name must be a string." )


class Itinerary( db.Model, SerializerMixin ):
    __tablename__ = 'itineraries'

    # serialize_rules = ( '-trip.itineraries', '-activity.itineraries', )

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

    def i_to_dict( self ):
        return {
            "id": self.id, 
            "weekday": self.weekday,
            "trip_name": self.trip.name,
            "activity_name": self.activity.name
        }
    
    @validates( 'weekday' )
    def validate_weekday( self, key, weekday ):
        if isinstance( weekday, str ) and weekday:
            return weekday
        else:
            abort( 422, "Weekday must be either: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, or Sunday." )
    

    @validates( 'trip_id' )
    def validate_trip_id( self, key, trip_id ):
        if isinstance( trip_id, int ) and trip_id > 0 and trip_id:
            return trip_id
        else:
            abort( 422, "Trip id must be an instance of User greater than 0." )
    
    @validates( 'activity_id' )
    def validate_activity_id( self, key, activity_id ):
        if isinstance( activity_id, int ) and activity_id > 0 and activity_id:
            return activity_id
        else:
            abort( 422, "Activity id must be an instance of Activity greater than 0." )

    
class Trip( db.Model, SerializerMixin ):
    __tablename__ = 'trips'

    # serialize_rules = ( '-users.trips', '-user_trips.trips', '-users.trips', '-trip_destinations.trip', '-activities.trips', '-itineraries.trips', )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    start_date = db.Column( db.String )
    end_date = db.Column( db.String )
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
        return f'<Trip { self.name } users:{ self.users }, destinations:{ self.destinations } />'
    
    def t_to_dict( self ):
        return {
            "id": self.id,
            "name": self.name,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "accommodation": self.accommodation,
            "budget": self.budget,
            "notes": self.notes,
            "destinations": [ destination.d_to_dict() for destination in self.destinations ],
            "itineraries": [ itinerary.i_to_dict() for itinerary in self.itineraries ],
            "activities": [ activity.a_to_dict() for activity in self.activities ]
        }
    
    @validates( 'name' )
    def validate_name( self, key, name ):
        if isinstance( name, str ) and name:
            return name
        else:
            abort( 422, "Name is required and must be a string." )

    @validates( 'start_date' )
    def validate_start_date( self, key, start_date ):
        if isinstance( start_date, str ) and start_date and start_date.count( '-' ) == 2:
            return start_date
        else:
                abort( 422, "Invalid start date format. Expected:'yyyy-mm-dd'." )
               
    @validates( 'end_date' )
    def validate_end_date( self, key, end_date ):
        if isinstance( end_date, str ) and end_date and end_date.count( '-' ) == 2:
            return end_date
        else:
                abort( 422, "Invalid end date format. Expected:'yyyy-mm-dd'." )

    @validates( 'accommodation' )
    def validate_accommodation( self, key, accommodation ):
        if isinstance( accommodation, str ):
            return accommodation
        else:
            abort( 422, "Accommodation must be a string." )

    @validates( 'budget' )
    def validate_budget( self, key, budget ):
        if isinstance( budget, int ) and budget >= 1:
            return budget
        else:
            abort( 422, "Budget must be a must be an integer greater than 0." )

    @validates( 'notes' )
    def validate_notes( self, key, notes ):
        if isinstance( notes, str ) and len( notes ) <= 500:
            return notes
        else:
            abort( 422, "Notes must be a string under 500 characters." )

    
class UserTrip( db.Model, SerializerMixin ):
    __tablename__ = 'user_trips'

    # serialize_rules = ( '-trip.user_trips', '-user.user_trips', )

    id = db.Column( db.Integer, primary_key=True )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    user_id = db.Column( db.Integer, db.ForeignKey( 'users.id' ) )
    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) )

    user = db.relationship( 'User', back_populates='user_trips' )
    trip = db.relationship( 'Trip', back_populates='user_trips' )

    def __repr__( self ): 
        return f'<UserTrip{ self.id } user_id:{ self.user_id }, trip_id:{ self.trip_id} />'
    
    def ut_to_dict( self ):
        return {
            "id": self.id,
            "username": self.user.username,
            "trip_name": self.trip.name
        }
    
    @validates( 'user_id' )
    def validate_user_id( self, key, user_id ):
        if isinstance( user_id, int ) and user_id > 0 and user_id:
            return user_id
        else:
            abort( 422, "User id must be an instance of User greater than 0." )

    @validates( 'trip_id' )
    def validate_trip_id( self, key, trip_id ):
        if isinstance( trip_id, int ) and trip_id > 0 and trip_id:
            return trip_id
        else:
            abort( 422, "Trip id must be an instance of Trip greater than 0." )

    
class Destination( db.Model, SerializerMixin ):
    __tablename__ = 'destinations'

    # serialize_rules = ( '-destinations.trips', '-trip_destinations.trip', )

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

    def d_to_dict( self ):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image": self.image_url
        }

    @validates( 'name' )
    def validate_name( self, key, name ):
        if isinstance( name, str ) and name:
            return name
        else:
            abort( 422, "Name is required and must be a string." )

    @validates( 'description' )
    def validate_description( self, key, description ):
        if isinstance( description, str ) and len( description ) <= 500  and description:
            return description
        else:
            abort( 422, "Description must be a string under 500 characters." )
    
    @validates( 'image_url' )
    def validate_image( self, key, image ):
        if isinstance( image, str ) and image:
            return image
        else:
            abort( 422, "Image url must be a string." )
    
class TripDestination( db.Model, SerializerMixin ):
    __tablename__ = 'trip_destinations'

    # serialize_rules = ( '-trip.trip_destinations', '-user.trip_destinations', )

    id = db.Column( db.Integer, primary_key=True )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    trip_id = db.Column( db.Integer, db.ForeignKey( 'trips.id' ) ) 
    destination_id = db.Column( db.Integer, db.ForeignKey( 'destinations.id' ) )

    trip = db.relationship( 'Trip', back_populates='trip_destinations' )
    destination = db.relationship( 'Destination', back_populates='trip_destinations' )

    def __repr__( self ):
        return f'<TripDestination { self.id } trip_id:{ self.trip_id }, destination_id:{ self.destination_id } />'
    
    def td_to_dict( self ):
        return {
            "id": self.id,
            "trip_name": self.trip.name,
            "destination_name": self.destination.name
        }
    
    @validates( 'trip_id' )
    def validate_trip_id( self, key, trip_id ):
        if isinstance( trip_id, int ) and trip_id > 0 and trip_id:
            return trip_id
        else:
            abort( 422, "Trip id must be an instance of Trip greater than 0." )

    @validates( 'destination_id' )
    def validate_destination_id( self, key, destination_id ):
        if isinstance( destination_id, int ) and destination_id > 0 and destination_id:
            return destination_id
        else:
            abort( 422, "Destination id must be an instance of Destination greater than 0." )

    
class Activity( db.Model, SerializerMixin ):
    __tablename__ = 'activities'

    # serialize_rules = ( '-itineraries.activity', '-trips.activities', )

    id = db.Column( db.Integer, primary_key=True )
    name = db.Column( db.String )
    description = db.Column( db.String )
    time = db.Column( db.String )
    duration = db.Column( db.String )
    location = db.Column( db.String )
    notes = db.Column( db.String )
    created_at = db.Column( db.DateTime, server_default=db.func.now() )
    updated_at = db.Column( db.DateTime, onupdate=db.func.now() )

    itineraries = db.relationship( 'Itinerary', back_populates='activity' )
    trips = association_proxy( 'itineraries', 'trip', creator=lambda t: Itinerary( trip=t ) )

    def __repr__( self ):
        return f'<Activity { self.name } />'
    
    def a_to_dict( self ):
        return {
            "id": self.id,
            "name": self.name,
            "description":  self.description,
            "time": self.time,
            "duration": self.duration,
            "location": self.location,
            "notes": self.notes,
            "itineraries": [ itinerary.i_to_dict() for itinerary in self.itineraries ]
        }

    @validates( 'name' )
    def validate_name( self, key, name ):
        if isinstance( name, str ) and name:
            return name
        else:
            abort( 422, "Name is required and must be a string." )

    @validates( 'description' )
    def validate_description( self, key, description ):
        if isinstance( description, str ) and len( description ) <= 500:
            return description
        else:
            abort( 422, "Description must be a string under 500 characters." )

    @validates( 'time' )
    def validate_time( self, key, time ):
        if isinstance( time, str ) and ( 'am' in time or 'pm' in time ):
            return time
        else:
            abort( 422, "Time must be a string and include either am or pm." )

    @validates( 'duration' )
    def validate_duration( self, key, duration ):
        if isinstance( duration, str ) and ( 'mins' in duration or 'hrs' in duration ):
            return duration
        else:
            abort( 422, "Duration must be a string and include either mins or hrs." )

    @validates( 'location' )
    def validate_location( self, key, location ):
        if isinstance( location, str ) and len( location ) <= 100:
            return location
        else:
            abort( 422, "Location must be a string under 100 characters." )

    @validates( 'notes' )
    def validate_notes( self, key, notes ):
        if isinstance( notes, str ) and len( notes ) <= 500:
            return notes
        else:
            abort( 422, "Notes must be a string under 500 characters." )