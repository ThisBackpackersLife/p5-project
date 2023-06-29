import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import TripCard from "./TripCard";
import NewTripForm from "./NewTripForm";
import { Container } from "@mui/system";
import { Grid, Button } from "@mui/material";

function Trips({  selectTripId, isFormVisible, toggleFormVisibility }) {
    
    const { user } = useContext( UserContext )

    if ( !user || !user.trips ) {
        return null
    }
    
    
    const renderTrips = user.trips.map( trip => 
        <TripCard 
            key={ trip.id }
            id={ trip.id } 
            trip={ trip } 
            selectTripId={ selectTripId }
        />
    )

    return(
    <Container maxWidth="sm"> 
        <Grid container spacing={ 2 }>
            { renderTrips }
        </Grid>
        {isFormVisible ? (
        <>
          <Button variant="outlined" onClick={ toggleFormVisibility }>
            Hide Form
          </Button>
          <NewTripForm />
        </>
      ) : (
        <Button variant="outlined" onClick={toggleFormVisibility}>
          Show New Trip Form
        </Button>
      )}
    </Container>
    )
}

export default Trips;