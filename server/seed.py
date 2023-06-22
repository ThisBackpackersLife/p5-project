#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from config import db, Bcrypt
from models import User, Trip, UserTrip, Destination, TripDestination, Activity, Itinerary

image_url = open( "./data/ImageUrls.txt", "r" )
weekday = open( "./data/Weekdays.txt", "r" )
fun_activity = open( "./data/Activity.txt", "r" )

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():

        urls = []
        weekdays = []
        fun_activities = []

        for image in image_url:
            urls.append( image.replace("\n","") )
        for day in weekday:
            weekdays.append( day.replace("\n", "") )
        for activity in fun_activity:
            fun_activities.append( activity.replace("\n", "") )


        print( "Starting seed..." )
        # Seed code goes here!

        print( "Deleting data..." )
        User.query.delete()
        Trip.query.delete()
        UserTrip.query.delete()
        Destination.query.delete()
        TripDestination.query.delete()
        Itinerary.query.delete()
        Activity.query.delete()

        print( "Creating Users..." )
        users = []
        for i in range( 100 ):
            user = User(
                username = fake.first_name(),
                email = fake.email(),
                _password_hash = randint( 1000000,9999999 ),
                first_name = fake.first_name(),
                last_name = fake.last_name()
            )
            users.append( user )

        print( "Creating Trips..." )
        trips = []
        for i in range( 50 ):
            trip = Trip(
                name = fake.city(),
                start_date = fake.date(),
                end_date = fake.date(),
                accommodation = fake.company(),
                budget = fake.random_int( min=1000, max=100000 ),
                notes = fake.paragraph( nb_sentences=2 )
            )
            trips.append( trip )

        print( "Creating Destinations..." )
        destinations = []
        for i in range( 49 ):
            destination = Destination(
                name = fake.city(),
                description = fake.paragraph( nb_sentences=2 ),
                image_url = urls[ randint(0, 49 ) ]
            )
            destinations.append( destination )
        
        print( "Creating Activities..." )
        activities = []
        for i in range( 49 ):

            time_sentence = fake.sentence()
            if "am" not in time_sentence and "pm" not in time_sentence:
                time_sentence += " " + rc(["am", "pm"])

            duration_sentence = fake.sentence()
            if "mins" not in duration_sentence and "hrs" not in duration_sentence:
                duration_sentence += " " + rc(["mins", "hrs"])

            activity = Activity(
                name = fun_activities[ i ],
                description = fake.paragraph( nb_sentences=2 ),
                time = time_sentence,
                duration = duration_sentence,
                location = fake.city(),
                notes = fake.paragraph( nb_sentences=2 )
            )
            activities.append( activity )

        print( "Creating UserTrips...")
        # create user_trips:
        user_trips = []
        for i in range( 50 ):
            random_user = rc( users )
            random_trip = rc( trips )
            user_trip = UserTrip( user=random_user, trip=random_trip )
            user_trips.append( user_trip )


        print( "Creating TripDestinations..." )
        trip_destinations = []
        for i in range( 50 ):
            random_trip = rc( trips )
            random_dest = rc( destinations )
            trip_destination = TripDestination( trip=random_trip, destination=random_dest )
            trip_destinations.append( trip_destination )

        print( "Creating Itineraries..." )
        itineraries = []
        for i in range( 200 ):
            random_trip = rc( trips )
            random_activity = rc( activities )
            itinerary = Itinerary( weekday=weekdays[ i ], trip=random_trip, activity=random_activity )
            itineraries.append( itinerary )  

        db.session.add_all( users )
        db.session.add_all( trips )
        db.session.add_all( destinations )
        db.session.add_all( activities )
        db.session.add_all( user_trips )
        db.session.add_all( trip_destinations )
        db.session.add_all( itineraries )
        db.session.commit()

        print( "Seed Success!" )