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

  const submitNewTripForm = ( event, newTrip, formRef, eventHandlers ) => {
    console.log( formRef, eventHandlers )
    event.preventDefault()
  
    newTrip.budget = parseInt( newTrip.budget )
  
    if ( user.id > 0 ) {
      axios
        .post( "//localhost:5555/trips", { ...newTrip, userId: user.id })
        .then( async ( response ) => {
          const newTripInstance = { ...response.data }
  
          const updateUserTrips = {
            ...user,
            trips: [ ...user.trips, newTripInstance ],
          }
  
          const updateTripPromise = axios.patch(
            `//localhost:5555/users/${ user.id }`,
            {
              trips: updateUserTrips.trips,
            }
          )
  
          const updateUserPromise = axios.patch(
            `//localhost:5555/trips/${ newTripInstance.id }`,
            {
              userId: user.id,
            }
          )
  
          await Promise.all([ updateTripPromise, updateUserPromise ])
          return updateUserTrips
        })
        .then( ( updateUserTrips ) => {
          setUser( updateUserTrips )
          console.log( "Trip created successfully!" )

          // Reset the form fields after successful trip creation
          formRef.current.reset()

          // Call the event handlers to clear the state variables in NewTripForm component
          console.log( eventHandlers.handleTripNameChange, eventHandlers.handleStartDateChange, eventHandlers.handleEndDateChange, eventHandlers.handleAccommodationChange, eventHandlers.budget, eventHandlers.notes )
          eventHandlers.handleTripNameChange( "" )
          eventHandlers.handleStartDateChange( "" )
          eventHandlers.handleEndDateChange( "" )
          eventHandlers.handleAccommodationChange( "" )
          eventHandlers.handleBudgetChange( "" )
          eventHandlers.handleNotesChange( "" )
        })
        .catch( ( error ) => {
          if ( error.response ) {
            // Request made and server responded with an error status
            console.error( "Error creating trip:", error.response.data )
          } else if ( error.request ) {
            // The request was made but no response was received
            console.error( "No response received:", error.request )
          } else {
            // Something happened in setting up the request that triggered an error
            console.error( "Error setting up the request:", error.message )
          }
        })
    } else {
      console.error( "Invalid user ID" )
    }
  }

  const deleteTrip = ( tripId ) => { 

    axios
      .delete( `/users/${ user.id }/trips/${ tripId }` )
      .then( ( response ) => {
        // console.log( `Deleted Trip ID:${ tripId }`, response.data ) 

        const updatedUser = { ...user }
        updatedUser.trips = updatedUser.trips.filter( trip => trip.id !== tripId )
        setUser( updatedUser )
      })
      .catch( ( error ) => {
        console.error( "Error deleting trip", error )
      })
  }

  const editTrip = async ( tripId, editTripInfo ) => {
    try {
      // Turn the budget string into an integer
      editTripInfo.budget = parseInt( editTripInfo.budget )

      // Create a partial editTripInfo object with only the filled-in fields
      const partialEditTripInfo = {}

      if( editTripInfo.name !== '') partialEditTripInfo.name = editTripInfo.name 
      if( editTripInfo.startDate !== '') partialEditTripInfo.start_date = editTripInfo.startDate
      if( editTripInfo.endDate !== '' ) partialEditTripInfo.end_date = editTripInfo.endDate
      if( editTripInfo.accommodation !== '' ) partialEditTripInfo.accommodation = editTripInfo.accommodation
      // Only include the budget field if it's greater than 0 or if it's provided by the user
      if( editTripInfo.budget !== '' && editTripInfo.budget > 0 ) { partialEditTripInfo.budget = editTripInfo.budget }
      if( editTripInfo.notes !== '' ) partialEditTripInfo.notes = editTripInfo.notes

      // Patch request to update the trip
      const tripResponse = await axios.patch( `//localhost:5555/trips/${ tripId }`, partialEditTripInfo )
      const updatedTrip = tripResponse.data

      // Update user.trips information
      const updatedUserTrips = user.trips.map( (trip) => trip.id === tripId ? { ...trip, ...updatedTrip } : trip )

      // Patch request to update the user's trips
      const userResponse = await axios.patch( `//localhost:5555/users/${ user.id }`, {
        trips: updatedUserTrips,
      })
      const updatedUser = userResponse.data

      // Update the user state with the new trips information
      setUser( updatedUser => ({ ...updatedUser, trips: updatedUserTrips }) )
    
    } catch( error ) {
      console.error( "Error updating trips:", error.response )
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
              <Route path="/trips" exact render={ () => <Trips selectTripId={ selectTripId } isFormVisible={ formVisibility } toggleFormVisibility={ toggleFormVisibility } submitNewTripForm={ submitNewTripForm } deleteTrip={ deleteTrip } editTrip={ editTrip } /> } />
              {/* <Route path="/itineraries/:id" exact component={ ComingSoonPage } /> */}
            </Switch>
        </UserContext.Provider>
      </div>
      
  );
}

export default App;