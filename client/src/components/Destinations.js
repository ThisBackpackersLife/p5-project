import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "./UserContext";

// import { Button, ButtonGroup } from "@mui/material";
import DestinationCard from "./DestinationCard";


function Destinations({ destinations, addDestinationToTrip, selectTrip }) {
    
    const renderDestinations = destinations.map( destination => 
        <DestinationCard 
            key={ destination.id }
            id={ destination.id}
            destination={ destination }
            addDestinationToTrip={ addDestinationToTrip }
            selectTrip={ selectTrip }
        />
        )

    return (
        <div id="destination-container">
            {/* Render the collection of DestinationCards */}
            { renderDestinations }
        </div>
    )
}

export default Destinations;