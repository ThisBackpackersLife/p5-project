import React, { useState, useEffect } from "react";
import TripCard from "./TripCard";
import NewTripForm from "./NewTripForm";
import httpClient from "./httpClient";

const baseUrl = "http://localhost:5555/"
const tripUrl = baseUrl + "/trips"

function Trips() {

    const [ trips, setTrips ] = useState( [] )

    useEffect( () => {
        fetchTrips();
    }, [] );
    
    const fetchTrips = async () => {
        try {
            const response = await axios.get( "/trips" );
            setTrips( response.data );
            console.log( response.data )
        } catch( error ) {
            console.error( "Error fetching trips:", error );
        }
    };


    return(
        <div>
            <NewTripForm />
            <TripCard />
        </div>
    )
}

export default Trips;

// useEffect( () => {
//     ( async () => {
//         try {
//             const response = await httpClient.get( `//localhost:5555/trips` )
//             console.log("Response:", response);
//             setTrips( response.data )
//             console.log( response.data )
//         }
//         catch ( error ) {
//             console.log( "Not authenticated" )
//         }
//     } ) ()
//   }, [] )