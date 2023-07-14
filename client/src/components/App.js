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
// import ComingSoon from "./ComingSoon";

function App() {
  
  const [ destinations, setDestinations ] = useState( [] )
  const [ trips, setTrips ] = useState( [] )
  const [ theme, setTheme ] = useState( 'light' )
  const [ isDarkMode, setDarkMode ] = useState( true )  
  const [ user, setUser ] = useState( null )
  const [ userData, setUserData ] = useState( "" )
  const [ selectTrip, setSelectTrip ] = useState( null )
  const [ formVisibility, setFormVisibility ] = useState( false )
  const [ searchDestinations, setSearchDestinations ] = useState( "" )
  
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
  }, [] )
    
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
      const response = await axios.get( `//localhost:5555/destinations/${ destinationId }` );
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
      }
      console.log( updatedUser )
      
      await axios.patch(`//localhost:5555/users/${ user.id }`, { trips: updatedTrips, } )
      
      setUser( updatedUser );
      
      console.log(`Destination${ destinationId } added to the trip successfully!`)
    } catch ( error ) {
      console.error("Error adding destination to the trip:", error)
    }
  }

  const selectTripId = id => setSelectTrip( id )

  const toggleFormVisibility = () => {
    setFormVisibility( !formVisibility );
  }

  const submitNewTripForm = async ( event, newTrip ) => {
    event.preventDefault()

    newTrip.budget = parseInt( newTrip.budget )
    
    try {
      if ( user.id 
        > 0 ) {
        const response = await axios.post( "//localhost:5555/trips", { ...newTrip, userId: user.id, })
        
        const newTripInstance = { trip: response.data }
        
        const updateUserTrips = {
          ...user, 
          trips: [ ...user.trips, newTripInstance ]
        }
        // delete updateUserTrips.username
        // delete updateUserTrips.email
        // // delete updateUserTrips.first_name
        // // delete updateUserTrips.last_name
        
        console.log( user.id )
        await axios.patch( `//localhost:5555/users/${ user.id }`, { 
          trips: updateUserTrips.trips, 
        })
        
        setUser( updateUserTrips )
        
        console.log( "Trip created successfully!", response.data ) 
    } else {
      console.error( "Invalid user ID" )
      return
    }
  } catch ( error ) {
      if ( error.response ) {
        // Request made and server responded with an error status
        console.error("Error creating trip:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received:", error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up the request:", error.message);
      }
    }
  }

  const changeSearchDestinations = e => setSearchDestinations( e.target.value )

  const filteredDestinations = destinations.filter( destination => 
    destination.name.toLowerCase().includes( searchDestinations.toLowerCase() ) 
  )


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
              <Route path='/destinations' exact render={ () => <Destinations destinations={ filteredDestinations } addDestinationToTrip={ addDestinationToTrip } selectTrip={ selectTrip } searchDestinations={ searchDestinations } changeSearchDestinations={ changeSearchDestinations } /> } />
              <Route path="/trips" exact render={ () => <Trips selectTripId={ selectTripId } isFormVisible={ formVisibility } toggleFormVisibility={ toggleFormVisibility } submitNewTripForm={ submitNewTripForm } /> } />
              {/* <Route path="/itineraries/:id" exact component={ ComingSoonPage } /> */}
            </Switch>
        </UserContext.Provider>
      </div>
      
  );
}

export default App;