import React, { useState } from "react";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";

function NewTripForm({ submitNewTripForm }) {

    const [ tripName, setTripName ] = useState( "" )
    // const [ destination, setDestination ] = useState( "" )
    const [ startDate, setStartDate ] = useState( "" )
    const [ endDate, setEndDate ] = useState( "" )
    const [ accommodation, setAccommodation ] = useState( "" )
    const [ budget, setBudget ] = useState( "" )
    const [ notes, setNotes ] = useState( "" )

    const handleTripNameChange = event  => {
        setTripName( event.target.value )
    }

//   const handleDestinationChange = event => {
//     setDestination( event.target.value )
//   }

    const handleStartDateChange = event => {
        setStartDate( event.target.value )
     }

    const handleEndDateChange = event => {
        setEndDate( event.target.value )
    }

    const handleAccommodationChange = event => {
        setAccommodation( event.target.value )
    }

    const handleBudgetChange = event => {
        setBudget( event.target.value )
    }

    const handleNotesChange = event => {
        setNotes( event.target.value )
    }

    const newTrip = {
        name: tripName,
        start_date: startDate,
        end_date: endDate,
        accommodation: accommodation,
        budget: budget,
        notes: notes,
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h5" component="div">
                New Trip
                </Typography>
                <form onSubmit={ e => submitNewTripForm( e, newTrip ) }>
                <TextField
                    label="Trip Name"
                    value={ tripName }
                    onChange={ handleTripNameChange }
                    fullWidth
                    required
                    margin="normal"
                />
                {/* <TextField
                    label="Destination"
                    value={ destination }
                    onChange={ handleDestinationChange }
                    fullWidth
                    required
                    margin="normal"
                    placeholder="Enter destination (city, country or city, state, country)"
                /> */}
                <TextField
                    label="Start Date"
                    type="text"
                    value={ startDate }
                    onChange={ handleStartDateChange }
                    fullWidth
                    required
                    margin="normal"
                    placeholder="yyyy-mm-dd"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="End Date"
                    type="text"
                    value={ endDate }
                    onChange={ handleEndDateChange }
                    fullWidth
                    required
                    margin="normal"
                    placeholder="yyyy-mm-dd"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="Accommodation"
                    value={ accommodation }
                    onChange={ handleAccommodationChange }
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Budget"
                    value={ budget }
                    onChange={ handleBudgetChange }
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Notes"
                    multiline
                    rows={ 4 }
                    value={ notes } 
                    onChange={ handleNotesChange }
                    fullWidth
                    margin="normal"
                />
                <Button type="submit" variant="contained" color="primary">
                    Create Trip
                </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default NewTripForm;