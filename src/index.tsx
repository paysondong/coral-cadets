import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Game from "./game/Game";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./game/SignUp";
import SignIn from "./game/SignIn";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const oauthClient =
  clientId ||
  "726356794954-9a5jbupct8timuemc39meojkdkul1afg.apps.googleusercontent.com";

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Game />} />
      <Route path="/game" element={<Game />} />
      <Route
        path="/signin"
        element={
          <GoogleOAuthProvider clientId={oauthClient}>
            <SignIn />
          </GoogleOAuthProvider>
        }
      />
      <Route
        path="/register"
        element={
          <GoogleOAuthProvider clientId={oauthClient}>
            <SignUp />
          </GoogleOAuthProvider>
        }
      />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
