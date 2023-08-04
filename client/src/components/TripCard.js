import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { Link } from "react-router-dom";

function TripCard({ trip, selectTripId, deleteTrip, editTrip, removeDestination }) {
    
    let { id, name, start_date, end_date, accommodation, budget, notes, destinations, itineraries, activities } = trip

    const [ editMode, setEditMode ] = useState( false )
    const [ editTripName, setEditTripName ] = useState( "" )
    const [ editStartDate, setEditStartDate ] = useState( "" )
    const [ editEndDate, setEditEndDate ] = useState( "" )
    const [ editAccommodation, setEditAccommodation ] = useState( "" )
    const [ editBudget, setEditBudget ] = useState( "" )
    const [ editNotes, setEditNotes ] = useState( "" )
    const [ destinationHover, setDestinationHover ] = useState( false )

    const handleEditTrip = () => setEditMode( !editMode )

    const handleEditName = event  => setEditTripName( event.target.value )

    const handleStartDate = event => setEditStartDate( event.target.value )

    const handleEndDate = event => setEditEndDate( event.target.value )

    const handleEditAccommodation = event => setEditAccommodation( event.target.value )

    const handleEditBudget = event => setEditBudget( event.target.value )

    const handleEditNotes = event => setEditNotes( event.target.value )

    const editTripInfo = {
        name: editTripName,
        startDate: editStartDate,
        endDate: editEndDate,
        accommodation: editAccommodation,
        budget: editBudget,
        notes: editNotes,
    }

    const handleDestinationEnter = () => setDestinationHover( true )
    const handleDestinationLeave = () => setDestinationHover( false )

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
                                            { !editMode ? (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={ <EditIcon /> }
                                                    onClick={ handleEditTrip }
                                                >
                                                    Edit Trip
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={ <SaveIcon /> }
                                                    onClick={ () => {
                                                        editTrip( id, editTripInfo )
                                                        handleEditTrip()
                                                    }}
                                                >
                                                    Save Trip
                                                </Button>
                                            )}

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
                                        {/* Display the trip name */}
                                        { !editMode ? (
                                            <Typography variant="h5" component="div">
                                                { name }
                                            </Typography>
                                        ) : (
                                            <TextField 
                                                label="Trip Name"
                                                value={ editTripName }
                                                onChange={ handleEditName }
                                                fullWidth
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                {/* Display other trip information */}
                                <div>
                                    {/* Start Date */}
                                    { !editMode ? (
                                        <Typography component="p">
                                            Start Date: { start_date }
                                        </Typography>
                                    ) : (
                                        <TextField 
                                            label="Start Date: yyyy-mm-dd"
                                            value={ editStartDate }
                                            onChange={ handleStartDate }
                                            fullWidth
                                        />
                                    )}
                                    {/* End Date */}
                                    { !editMode ? (
                                        <Typography component="p">
                                            End Date: { end_date }
                                        </Typography>
                                    ) : (
                                        <TextField
                                          label="End Date: yyyy-mm-dd"
                                          value={ editEndDate }
                                          onChange={ handleEndDate }
                                          fullWidth
                                        />
                                    )}
                                    {/* Accommodation */}
                                    { !editMode ? (
                                        <Typography component="p">
                                            Accommodation: { accommodation }
                                        </Typography>
                                    ) : (
                                        <TextField
                                          label="Accommodation"
                                          value={ editAccommodation }
                                          onChange={ handleEditAccommodation }
                                          fullWidth
                                        />
                                    )}
                                    {/* Budget */}
                                    { !editMode ? (
                                        <Typography component="p">
                                            Budget: { budget }
                                        </Typography>
                                    ) : (
                                        <TextField
                                          label="Budget"
                                          value={ editBudget }
                                          onChange={ handleEditBudget }
                                          fullWidth
                                        />
                                    )}
                                    {/* Notes */}
                                    { !editMode ? (
                                        <Typography component="p">
                                            Notes: { notes }
                                        </Typography>
                                    ) : (
                                        <TextField
                                          label="Notes"
                                          value={ editNotes }
                                          onChange={ handleEditNotes }
                                          fullWidth
                                        />
                                    )}
                                    {/* Destination links */}
                                    <Typography component="p">
                                        Destinations:{ " " }
                                        { destinations && destinations.length > 0 ? (
                                            destinations.map( destination => (
                                            <Button
                                                key={ `destination-${ destination.id }` }
                                                component={ Link }
                                                to={ `/destinations/${ destination.id }` }
                                                variant="outlined"
                                                onMouseEnter={ handleDestinationEnter }
                                                onMouseLeave={ handleDestinationLeave }
                                            >
                                                { destination.name }
                                                { destinationHover && (
                                                    <Button
                                                        variant="outlined"
                                                        startIcon={ <DeleteIcon /> }
                                                        onClick={ () => removeDestination( destination.id ) }
                                                    >
                                                    </Button>
                                                )}
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