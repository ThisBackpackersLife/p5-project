import React from 'react';
import App from '../src/components/App';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
// local imports go here:
import theme from './components/theme';

const root = ReactDOM.createRoot( document.getElementById( 'root' ) );
root.render(
    <BrowserRouter>
        <React.StrictMode>
            <ThemeProvider theme={ theme }>
                <CssBaseline />
                    <App />
                </ThemeProvider>
        </React.StrictMode>
    </BrowserRouter>
);