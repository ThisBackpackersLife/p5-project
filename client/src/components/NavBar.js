import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import Logo from "../images/Logo.png";
import UserIcon from "../images/UserIcon.png";
import httpClient from "./httpClient";
import Trips from "./Trips";
import { UserContext } from "./UserContext";
// import { useContext } from "react";


function NavBar({ toggleTheme, isDarkMode, trips }) {

    const { user, setUser } = useContext( UserContext )
    
    const history = useHistory()
    
    const logout = async () => {
        try {
            await httpClient.delete( '/logout' )
            await httpClient.delete( '/clear' )
            setUser( null )
            history.push( "/login" )
        } catch ( error ) {
            console.error( "Logout failed." )
        } 
    }

    const buttonText = isDarkMode ? "Light Mode" : "Dark Mode";

    return (
        <header>
            <nav className="nav">
                <Link to="/" className="link">
                    <div className="logo-container">
                        <img className="image" src={ Logo } alt="Logo"></img>
                    </div>
                </Link>
                <button className="sort-btn" onClick={ toggleTheme }>{ buttonText }</button>
                <div className="nav-ul">
                    <div className="active">
                        <Link to="/" className="link">
                            Home
                        </Link>
                    </div>
                    <div className="active">
                        <Link to="/destinations" className="link">
                            Destinations
                        </Link>
                    </div>
                    { user !== null ? (
                        <div className="active user-icon-container">
                            <Link to="/trips" className="link">
                                <img src={ UserIcon } alt="User Icon"></img>
                            </Link>
                            <Trips trips={ trips } />
                        </div>
                    ): (
                        <div className="active user-icon-container" >
                            <Link to="/login" className="link">
                                <img src={ UserIcon } alt="User Icon"></img>
                            </Link>
                        </div>
                    )}
                    { user !== null && ( 
                        <div className="active user-icon-container">
                        <button onClick={ logout }>Logout</button>
                        </div>
                    )}
                    {/* <div className="active">
                        <Link to="/search" className="link">
                            Search
                        </Link>
                    </div> */}
                </div>
            </nav>
        </header>
    )}

export default NavBar;
