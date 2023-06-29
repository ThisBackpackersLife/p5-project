import React, { useEffect, useState, useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import NavBar from "./NavBar";
import Login from "./Login";
import "./app.css";
import httpClient from "./httpClient";
import SignUp from "./Signup";
import Destinations from "./Destinations";
import axios from "axios";
import { UserContext } from "./UserContext";
import Trips from "./Trips";

function App() {
  
  const [ destinations, setDestinations ] = useState( [] )
  const [ trips, setTrips ] = useState( [] )
  const [ theme, setTheme ] = useState( 'light' )
  const [ isDarkMode, setDarkMode ] = useState( true )  
  const [ user, setUser ] = useState( null )
  const [ userData, setUserData ] = useState( "" )
  const [ selectTrip, setSelectTrip ] = useState( null )
  const [ formVisibility, setFormVisibility ] = useState( false );
  
  const value = useMemo( () => ({ user, setUser }), [ user, setUser ])

  useEffect( () => {
      ( async () => {
          try {
            const response = await httpClient.get( "//localhost:5555/check_session" )
            setUser( response.data )
          }
          catch ( error ) {
            console.log( "Not authenticated" )
          }
      }) ()
  }, [ user ] )
    
    useEffect( () => {
      ( async () => {
          try {
              const response = await httpClient.get( `//localhost:5555/users/${ user.id }` )
              setUserData( response.data )
          }
          catch ( error ) {
              console.log( "Not authenticated" )
          }
      }) ()
  }, [ user ] )

  const toggleTheme = () => {
    if ( theme === 'light' ) {
        setTheme( 'dark' );
        setDarkMode( true )
    } else {
        setTheme( 'light' );
        setDarkMode( false )
    }
  };

  useEffect(() => {
    localStorage.setItem( 'theme', theme );
    document.body.className = theme;
  }, [ theme ] );

  useEffect( () => {
    ( async () => {
      try {
        const response = await axios.get( "//localhost:5555/destinations" );
        setDestinations( response.data );
      } 
      catch ( error ) {
        console.error( "Error fetching destinations:", error );
      }
    }) ()
  }, [] )

  useEffect( () => {
    ( async () => {
        try {
            const response = await httpClient.get( `//localhost:5555/trips` )
            setTrips( response.data )
        }
        catch ( error ) {
            console.log( "Not authenticated" )
        }
    } ) ()
  }, [] )

  const addDestinationToTrip = async ( destinationId ) => {
    try {
      const response = await axios.get( `//localhost:5555/destinations/${destinationId}` );
      const destination = response.data;
  
      const updatedTrips = user.trips.map( trip => {
        if ( trip.id === selectTrip ) {
          return {
            ...trip,
            destinations: [ ...trip.destinations, destination ],
          }
        }
        return trip
      })
  
      const updatedUser = {
        ...user,
        trips: updatedTrips,
      };
      
      await axios.patch(`//localhost:5555/users/${ user.id }`, { trips: updatedTrips, } );
      
      setUser( updatedUser );
      
      console.log(`Destination${ destinationId } added to the trip successfully!`);
    } catch ( error ) {
      console.error("Error adding destination to the trip:", error);
    }
  }

  const selectTripId = id => setSelectTrip( id )

  const toggleFormVisibility = () => {
    setFormVisibility( !formVisibility );
  }

  const submitNewTripForm = event => {
    event.preventDefault()
  }

  return (
      <div>
        <UserContext.Provider value={ value }>
          <NavBar 
            isDarkMode={ isDarkMode }  
            toggleTheme={ toggleTheme } 
            trips={ trips }
          />
            <Switch>
              <Route path='/' exact component={ Home } />
              <Route path='/login' exact component={ Login } />
              <Route path='/signup' exact component={ SignUp } />
              <Route path='/destinations' exact render={ () => <Destinations destinations={ destinations } addDestinationToTrip={ addDestinationToTrip } selectTrip={ selectTrip } /> } />
              <Route path="/trips" exact render={ () => <Trips selectTripId={ selectTripId } isFormVisible={ formVisibility } toggleFormVisibility={ toggleFormVisibility } submitNewTripForm={ submitNewTripForm } /> } />
            </Switch>
        </UserContext.Provider>
      </div>
      
  );
}

export default App;