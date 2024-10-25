import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);