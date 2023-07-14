import { IconButton, TextField, Box } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

function Search({ searchDestinations, changeSearchDestinations }) {
  

    return (
    <Box display="flex" justifyContent="center" alignItems="center">
        <div className="searchbar">
            <TextField 
                id="search"
                type="text"
                placeholder="Search Destinations"
                value={ searchDestinations }
                onChange={ changeSearchDestinations }
            />
            <IconButton type="submit">
                <SearchIcon />
            </IconButton>
        </div>
    </Box>
    );
    }

export default Search;