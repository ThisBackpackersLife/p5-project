import React from "react";
import DestinationCard from "./DestinationCard";
import Search from "./Search";


function Destinations({ destinations, addDestinationToTrip, selectTrip, searchDestinations, changeSearchDestinations }) {
    
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
            <Search 
                searchDestinations={ searchDestinations } 
                changeSearchDestinations={ changeSearchDestinations }
            />
            { renderDestinations }
        </div>
    )
}

export default Destinations;