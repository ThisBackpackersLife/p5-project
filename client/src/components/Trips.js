import React, { useContext } from "react";
import TripCard from "./TripCard";
import NewTripForm from "./NewTripForm";
import { Container } from "@mui/system";
import { UserContext } from "./UserContext";

function Trips({ trips }) {
    
    const { user } = useContext( UserContext )

    const userTrips = trips.filter( trip => user.trips. );
    console.log( userTrips )

    // const userTrips = trips.filter( trip => trip.user.id === user.id ); 
    // console.log( userTrips )

    const renderTrips = trips.map( trip => 
        <TripCard 
            id={ trip.id }
            trip={ trip }
        />
        )

    return(
    <Container maxWidth="sm"> 
        <NewTripForm />
        { renderTrips }
    </Container>
    )
}

export default Trips;