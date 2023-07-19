import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

function TripCard({ trip, selectTripId, deleteTrip  }) {
    
    let { id, name, start_date, end_date, accommodation, budget, notes, destinations, itineraries, activities } = trip

    return(
        <>
            <div onClick={ () => selectTripId( id ) } style={{ cursor: "pointer" }}>
                <Grid container>
                    <Grid item sm={ 30 } md={ 30 }>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={ 2 } sm={ 10 }>
                                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                                            {/* Edit Trip Button */}
                                            <Button
                                                variant="outlined"
                                                startIcon={ <EditIcon /> }
                                                onClick={ null }
                                            >
                                                Edit Trip
                                            </Button>
                                            {/* Delete Trip Button */}
                                            <Button
                                                variant="outlined"
                                                startIcon={ <DeleteIcon /> }
                                                onClick={ () => deleteTrip( id ) }
                                            >
                                                Delete Trip
                                            </Button>
                                        </div>
                                    </Grid>
                                    <Grid item xs={ 10 } sm={ 10 }>
                                        <Typography variant="h5" component="div">
                                            { name }
                                        </Typography>
                                    </Grid>
                                </Grid>
                                {/* Display other trip information */}
                                <div>
                                    <Typography component="p">
                                        Start Date: { start_date }
                                    </Typography>
                                    <Typography component="p">
                                        End Date: { end_date }
                                    </Typography>
                                    <Typography component="p">
                                        Accommodation: { accommodation }
                                    </Typography>
                                    <Typography component="p">
                                        Budget: { budget }
                                    </Typography>
                                    <Typography component="p">
                                        Notes: { notes }
                                    </Typography>
                                    {/* Destination links */}
                                    <Typography component="p">
                                        Destinations:{ " " }
                                        { destinations && destinations.length > 0 ? (
                                            destinations.map( ( destination ) => (
                                            <Button
                                                key={ `destination-${destination.id}` }
                                                component={ Link }
                                                to={ `/destinations/${ destination.id }` }
                                                variant="outlined"
                                            >
                                                { destination.name }
                                            </Button>
                                            ))
                                            ) : (
                                                "No destinations available."
                                            )}
                                            <Button
                                                component={ Link }
                                                to="/destinations"
                                                variant="outlined"
                                                startIcon={ <AddIcon /> }
                                            >
                                                Add Destination
                                            </Button>
                                    </Typography>
                                    {/* Itinerary links */}
                                    <Typography component="p">
                                        Itineraries:{ " " }
                                        { itineraries && itineraries.length > 0 ? (
                                            itineraries.map( ( itinerary ) => (
                                            <Button
                                                key={ `itinerary-${ itinerary.id }` }
                                                component={ Link }
                                                to={ `/itineraries/${ itinerary.id }` }
                                                variant="outlined"
                                            >
                                                { itinerary.name }
                                            </Button>
                                        ))
                                        ) : (
                                            "No itineraries available."
                                        )}
                                    </Typography>
                                    {/* Activity links */}
                                    <Typography component="p">
                                        Activities:{ " " }
                                        { activities && activities.length > 0 ? (
                                            activities.map( ( activity, index ) => (
                                            <Button
                                                key={ `activity-${ activity.id }-${ index }` }
                                                component={ Link }
                                                to={ `/activities/${ activity.id }` }
                                                variant="outlined"
                                            >
                                                { activity.name }
                                            </Button>
                                        ))
                                        ) : (
                                            "No activities available."
                                        )}
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default TripCard;