import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Box, CircularProgress } from '@mui/material';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
  },
}));

const ComingSoon = () => {
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <Typography variant="h2" component="h1" align="center">
        Coming Soon
      </Typography>
      <Box mt={4}>
        <CircularProgress />
      </Box>
    </Box>
  );
};

export default ComingSoon;