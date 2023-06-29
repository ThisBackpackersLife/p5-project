import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

function NewTripForm() {
  const [ tripName, setTripName ] = useState( "" )
  const [ startDate, setStartDate ] = useState( "" )
  const [ endDate, setEndDate ] = useState( "" )
  const [ accommodation, setAccommodation ] = useState( "" )
  const [ budget, setBudget ] = useState( "" )
  const [ notes, setNotes ] = useState( "" )
  const [ destination, setDestination ] = useState( "" )

  const handleTripNameChange = event  => {
    setTripName( event.target.value )
  }

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

  const handleSubmit = event => {
    event.preventDefault()
    
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          New Trip
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Trip Name"
            value={tripName}
            onChange={handleTripNameChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Accommodation"
            value={accommodation}
            onChange={handleAccommodationChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Budget"
            value={budget}
            onChange={handleBudgetChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Notes"
            multiline
            rows={4}
            value={notes}
            onChange={handleNotesChange}
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