import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        cursor: "pointer",
    },
    media: {
        height: "200px",
    },
})

function DestinationCard({ id, destination, addDestinationToTrip, selectTrip  }) {

    let { name, description, image } = destination

    const classes = useStyles()

    const clickAddDestination = () => {
        addDestinationToTrip( id )
    }

    return(
        <Card className={ classes.card } onClick={ clickAddDestination }>
            <CardMedia 
                className={ classes.media }
                component="img"
                height="200"
                image={ image }
                alt="Destination Photo"
            />
            <CardContent>
                <Typography variant="h5" component="div">
                    { name }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    { description }
                </Typography>
            </CardContent>
        </Card>
    )
}

export default DestinationCard;