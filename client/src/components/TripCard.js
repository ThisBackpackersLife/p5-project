import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function TripCard({ trip }) {

    let { id, name } = trip

    return(
        <div>
            <Card key={ id } variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        { name }
                    </Typography>
                    {/* Display other trip information */}
                </CardContent>
            </Card>
            
        </div>
    )
}

export default TripCard;