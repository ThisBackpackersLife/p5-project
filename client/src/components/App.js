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
import UserProvider, { UserContext } from "./UserContext";
import { useContext } from "react";

function App() {

  // const { user, changeSetUser, userData, changeSetUserData } = useContext( UserContext )
  
  const [ destinations, setDestinations ] = useState( [] )
  const [ trips, setTrips ] = useState( [] )
  const [ theme, setTheme ] = useState( 'light' )
  const [ isDarkMode, setDarkMode ] = useState( true )  
  const [ user, setUser ] = useState( null )
  const [ userData, setUserData ] = useState( "" )
  
  const value = useMemo( () => ({ user, setUser }), [ user, setUser ])

  useEffect( () => {
      ( async () => {
          try {
            console.log(user)
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
    
  // function changeSetUser() {
  //     setUser( "" )
  // }
  
  // function changeSetUserData() {
  //     setUserData( "" )
  // }

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

  return (
      <div>
        <UserContext.Provider value={ value }>
          <NavBar 
            // currentUser={ user }
            // userData={ userData }
            // changeSetUser={ changeSetUser }
            isDarkMode={ isDarkMode }  
            toggleTheme={ toggleTheme } 
            trips={ trips }
          />
            <Switch>
              <Route path='/' exact component={ Home } />
              <Route path='/login' exact component={ Login } />
              <Route path='/signup' exact component={ SignUp } />
              <Route path='/destinations' exact render={ () => <Destinations destinations={ destinations } /> } />
            </Switch>
        </UserContext.Provider>
      </div>
      
  );
}

export default App;