#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, make_response, jsonify, request
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Trip, UserTrip, Destination, TripDestination, Activity, Itinerary
# Views go here!

@app.route('/')
def home():
    return ''


if __name__ == '__main__':
    app.run(port=5555, debug=True)
