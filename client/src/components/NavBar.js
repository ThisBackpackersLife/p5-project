import React from "react";
import { Link, useHistory } from "react-router-dom";
// mui imports go here:
// import { Button } from "@mui/material";
// local imports go here:
import Logo from "../images/Logo.png";
import UserIcon from "../images/UserIcon.png";
import httpClient from "./httpClient";

function NavBar({ user, userData, changeSetUser, toggleTheme, isDarkMode }) {

    const history = useHistory()
    
    const logout = async () => {
        try {
            await httpClient.delete( '/logout' )
            await httpClient.delete( '/clear' )
            changeSetUser()
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
                    { user !== "" ? (
                        <div className="active user-icon-container">
                            <Link to="/trips" className="link">
                                <img src={ UserIcon } alt="User Icon"></img>
                            </Link>
                        </div>
                    ): (
                        <div className="active user-icon-container" >
                            <Link to="/login" className="link">
                                <img src={ UserIcon } alt="User Icon"></img>
                            </Link>
                        </div>
                    )}
                    {user !== "" && ( 
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
