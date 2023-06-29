# Standard library imports

# Remote library imports
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# Local imports

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Instantiate secret key
app.secret_key = "b'\x99\x98\\@>\xa1\xb0F\xff\xff\x1b\xf6\xf1}\xc6\x84'"

# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy( metadata=metadata )
migrate = Migrate( app, db )
db.init_app( app )

# Instantiate REST API
api = Api( app )

# Instantiate CORS
CORS( app, supports_credentials=True, resources={r"/*":{"origins": "*"}}, methods=[ "GET", "POST", "PATCH", "DELETE" ] ) 