import React from "react";
// import { Button, ButtonGroup } from "@mui/material";
import DestinationCard from "./DestinationCard";


function Destinations({ destinations }) {
    
    const renderDestinations = destinations.map( d => 
        <DestinationCard 
            id={ d.id}
            d={ d }
            destinations={ destinations }
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