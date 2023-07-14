import React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

function TripCard({ trip, selectTripId  }) {
    
    let { id, name, start_date, end_date, accommodation, budget, notes, destinations, itineraries, activities } = trip

    return(
        <>
            <div onClick={ () => selectTripId( id ) } style={{ cursor: "pointer" }}>
                <Grid container>
                    <Grid item sm={ 30 } md={ 30 }>
                        <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    { name }
                                </Typography>
                                {/* Display other trip information */}
                                <Typography>
                                    Start Date: { start_date }
                                </Typography>
                                <Typography>
                                    End Date: { end_date }
                                </Typography>
                                <Typography>
                                    Accommodation: { accommodation }
                                </Typography>
                                <Typography>
                                    Budget: { budget }
                                </Typography>
                                <Typography>
                                    Notes: { notes }
                                </Typography>
                                <Typography>
                                    Destinations:{ " " }
                                        { destinations && destinations.length > 0 ? (
                                            destinations.map( ( destination ) => (
                                            <Button
                                                component={ Link }
                                                to={ `/destinations/${ destination.id }` }
                                                variant="outlined"
                                            >
                                                { destination.name }
                                            </Button>
                                            ))
                                            ) : (
                                                <Typography>No destinations available.</Typography>
                                            )}
                                        <Button
                                            component={Link}
                                            to="/destinations"
                                            variant="outlined"
                                            startIcon={<AddIcon />}
                                        >
                                            Add Destination
                                        </Button>
                                </Typography>
                                <Typography>
                                    Itineraries:{ " " }
                                    { itineraries && itineraries.length > 0 ? (
                                        itineraries.map( ( itinerary ) => (
                                        <Button
                                            component={ Link }
                                            to={ `/itineraries/${ itinerary.id }` }
                                            variant="outlined"
                                        >
                                            { itinerary.name }
                                        </Button>
                                    ))
                                    ) : (
                                        <Typography>No itineraries available.</Typography>
                                    )}
                                </Typography>
                                <Typography>
                                    Activities:{ " " }
                                    { activities && activities.length > 0 ? (
                                        activities.map( ( activity ) => (
                                        <Button
                                            component={ Link }
                                            to={ `/activities/${ activity.id }` }
                                            variant="outlined"
                                        >
                                            { activity.name }
                                        </Button>
                                    ))
                                    ) : (
                                        <Typography>No activities available.</Typography>
                                    )}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default TripCard;