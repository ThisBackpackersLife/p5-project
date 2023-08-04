## ExploreMate

ExpoloreMate is a web application that allows users to plan out trips and discover new exciting destinations. Users can create, edit, and delete their planned trips, search for new destinations and add as many destinations per trip. Users can update their trip information in real time, and plan out their daily itineraries as well. Users can add as many other users to a trip, and let their friends edit the plans for any up coming group trip. 

## Functionality

### Routes

- `App.js`: The main component that handles routing and renders different components based on the current route. It sets up the navigation bar and defines routes for the home page, sign-in page, destinations page, user's trips page.
- `NavBar.js`: The navigation bar component displays the logo and links to different pages. It includes conditional rendering based on user authentication status.
- `Home.js`: The home page component that showcases the main features of the application - discover new destinations, plan future trips, and search for new activities in different locations.
- `Signup.js`: The sign up  page component that allows create a new account. It handles user authentication and redirects to the user trips page upon successful signup.
- `Login.js`: is the login page component which allows users to authenticate their account. Upon successful authentication, the user is redirected to their user trips page.
- `Destinations.js`: The destinations page component displays a collection of destination cards. Each card represents a destination and includes an image, name, and a couple sentence description. Users can click on a card to view the details of a specific destination.
- `Trips.js`: The user trips page component shows the user's created trips and all of it's relevant information. This is also where a user can create new trips, delete trips, or remove destinations from the trip. User's can add as many destinations as they want to a trip. 
- `DestinationDetails.js`: The destinations details page component displays detailed information about a specific destination, including its image, name, and a short description. Users can rate and review the destination, as well as edit or delete their existing reviews.

### Models

- 'models.py': Is the home to all the backend models. This is where you'll find the table structure for the User, Trip, Destination, Itinerary, and Activity models & their join tables. This file also includes all the validations for the db, to prevent bad information being submitted by a user. 
- `User`: The user model defines the structure and behavior of a user object. It includes properties like username, email, password, first name, and last name. It also provides methods for authentication, fetching a user's data and displaying their trip information.
- `Trip`: The trip model represents a trip object. This includes properties like name, start date, end date, accommodation, budget, and notes. It provides methods for retrieving a trips data and manages each trip's destinations, while also providing a view into their itineraries and associated activities.
- `Destination`: The destination model defines the structure of a destination object. This includes properties like name, an image, and a short description. It provides methods for creating, updating, and deleting destinations, along with validations that prevent user's from entering bad data.
- `Itinerary`: The itinerary model defines the structure of an itinerary object, while also being the join table for the trip and activity models. The model includes the property for which day of the week it is. It also provides validations as well.
- `Activity`: The activity model defines the structure of an activity object. The model includes properties like name, description, time, duration, location, and notes. It provides methods for retrieving activity data and validations as well.   


## Installation and Setup

1. Clone the repository to your local machine.
2. Install the necessary dependencies for backend with pipenv install && pipenv shell
3. Install the necessary dependencies by running `npm install` in the project directory.
4. cd into server file and run python app.py followed by python seed.py
5. Set up the database connection by configuring the database credentials in the `.env` file.
6. Initialize the development server with `npm start`.

## Technologies Used

- React: JavaScript library for building user interfaces.
- React Router: Library for handling client-side routing in a React application.
- Axios: Promise-based HTTP client for making API requests.
- HTML, CSS, JavaScript: Front-end technologies for building the user interface.
- Python, Flask, Flask RESTful, SQLALCHEMY

## Contributing

Contributions are welcome! If you have any suggestions or bug reports, please open an issue or submit a pull request on GitHub.


