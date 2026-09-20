import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Game from "./game/Game";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./game/SignUp";
import SignIn from "./game/SignIn";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);


const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={
        <GoogleOAuthProvider clientId={clientId || "726356794954-9a5jbupct8timuemc39meojkdkul1afg.apps.googleusercontent.com"}>
          <SignIn />
        </GoogleOAuthProvider>
      }/>
      <Route path="/register" element={
        <GoogleOAuthProvider clientId={clientId || "726356794954-9a5jbupct8timuemc39meojkdkul1afg.apps.googleusercontent.com"}>
          <SignUp />
        </GoogleOAuthProvider>
      } />
      <Route path="/game" element={<Game />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
