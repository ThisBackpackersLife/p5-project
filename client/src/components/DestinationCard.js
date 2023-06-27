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
    },
    media: {
        height: "200px",
    },
})

function DestinationCard({ d, destinations }) {

    let { name, description, image } = d

    const classes = useStyles()

    return(
        <Card className={ classes.card }>
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