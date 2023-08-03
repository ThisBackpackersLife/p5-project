## ExploreMate

ExpoloreMate is a web application that allows users to plan out trips and discover new exciting destinations. Users can create, edit, and delete their planned trips, search for new destinations and add as many destinations per trip. Users can update their trip information in real time, and plan out their daily itineraries as well. Users can add as many other users to a trip, and let their friends edit the plans for an up coming group trip. 

## Functionality

### Routes

- `App.js`: The main component that handles routing and renders different components based on the current route. It sets up the navigation bar and defines routes for the home page, sign-in page, restaurants page, search page, user profile page, and restaurant details page.
- `NavBar.js`: The navigation bar component that displays the logo and links to different pages. It also includes conditional rendering based on user authentication status, displaying the user's avatar or a default user icon.
- `Home.js`: The home page component that showcases the main features of the application - discovering new restaurants, rating and reviewing them, and sharing experiences.
- `Sign.js`: The sign-in page component that allows users to authenticate and log in to their accounts. It handles user authentication and redirects to the user profile page upon successful login.
- `Restaurants.js`: The restaurants page component that displays a collection of restaurant cards. Each card represents a restaurant and includes an image, name, and price range. Users can click on a card to view the details of a specific restaurant.
- `Search.js`: The search page component that provides a search form with filters for keyword, cuisine, price range, and dietary restrictions. Users can input their preferences and click the search button to get a list of matching restaurants.
- `UserPage.js`: The user profile page component that shows the user's avatar, their rated and reviewed restaurants, and options to sort reviews by rating or date. It also provides functionality to delete reviews.
- `RestaurantDetails.js`: The restaurant details page component that displays detailed information about a specific restaurant, including its image, name, and user reviews. Users can rate and review the restaurant and also edit or delete their existing reviews.

### Models

- `User.js`: The user model that defines the structure and behavior of a user object. It includes properties like username, email, password, and avatar. It also provides methods for authentication, fetching user data, and managing reviews.
- `Restaurant.js`: The restaurant model that represents a restaurant object. It includes properties like name, image, cuisine, price range, and dietary restrictions. It provides methods for retrieving restaurant data and managing reviews.
- `Review.js`: The review model that defines the structure of a review object. It includes properties like rating, body, image, and associated user and restaurant IDs. It provides methods for creating, updating, and deleting reviews.

- 'models.py': Is the home to all the backend models. This is where you can find the table structure for the User, Restaurant, and Review classes. This file also includes all of the validations for the db, to prevent bad information being submitted by the user. 

## Installation and Setup

1. Clone the repository to your local machine.
2. Install necessary dependencies for backend with pipenv install && pipenv shell
3. Install the necessary dependencies by running `npm install` in the project directory.
4. cd into server file and run python app.py followed by python seed.py
5. Set up the database connection by configuring the database credentials in the `.env` file.
6. Start the development server with `npm start`.

## Technologies Used

- React: JavaScript library for building user interfaces.
- React Router: Library for handling client-side routing in a React application.
- Axios: Promise-based HTTP client for making API requests.
- HTML, CSS, JavaScript: Front-end technologies for building the user interface.
- Python, Flask, Flask RESTful, SQLALCHEMY

## Contributing

Contributions are welcome! If you have any suggestions or bug reports, please open an issue or submit a pull request on GitHub.


