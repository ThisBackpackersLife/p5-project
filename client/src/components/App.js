import React, { useEffect, useState } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./Home";
import NavBar from "./NavBar";
import Login from "./Login";
import "./app.css";
import httpClient from "./httpClient";
import SignUp from "./Signup";
import Destinations from "./Destinations";
import axios from "axios";


function App() {

  const [ user, setUser ] = useState( "" )
  const [ userData, setUserData ] = useState( "" )
  const [ destinations, setDestinations ] = useState( [] )
  const [ theme, setTheme ] = useState( 'light' )
  const [ isDarkMode, setDarkMode ] = useState( true )
  
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
            const response = await httpClient.get( "//localhost:5555/check_session" )
            setUser( response.data )
        }
        catch ( error ) {
            console.log( "Not authenticated" )
        }
    }) ()
  }, [])

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


  function changeSetUser() {
    setUser( "" )
  }



  return (
      <div>
          <NavBar 
            user={ user }
            userData={ userData }
            changeSetUser={ changeSetUser }
            isDarkMode={ isDarkMode }  
            toggleTheme={ toggleTheme } 
          />
            <Switch>
              <Route path='/' exact component={ Home } />
              <Route path='/login' exact component={ Login } />
              <Route path='/signup' exact component={ SignUp } />
              <Route path='/destinations' exact render={ () => <Destinations destinations={ destinations } /> } />
            </Switch>
      </div>
      
  );
}

export default App;