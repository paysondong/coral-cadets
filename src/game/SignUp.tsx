import { useState } from "react";
import "./SignUp.css";
import { createUser } from "./UserUtil";
import { useNavigate } from "react-router";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';


function SignUp() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: codeResponse => {
      localStorage.setItem("userName", "random");
      localStorage.setItem("email", "random");
      localStorage.setItem("password", "random");
      localStorage.setItem("loggedInAt", Date.now().toString());
      window.location.href = "game";
    },
    flow: 'auth-code',
  });

  return (
      <div className="sign-up">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "5.3vw",
          }}
        >
          <img className="sign-up-back" src="images/sign-up/back.png" alt="" />
          <div className="sign-up-title">Sign Up</div>
          <img
            className="sign-up-back"
            src="images/sign-up/back.png"
            alt=""
            style={{ opacity: 0 }}
          />
        </div>
        <div>
          <img
            className="logo"
            src="images/logo.png"
            width={64}
            height={64}
          />
        </div>

        <div className="sign-up-form-title">Create account</div>

        <input
          className="sign-up-form-input"
          placeholder="Username"
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <input
          className="sign-up-form-input"
          placeholder="E-mail"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        />
        <input
          className="sign-up-form-input"
          placeholder="Password"
          type="password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <div
          className="sign-up-form-button"
          onClick={() => {
            if (
              userName !== "" &&
              email !== "" &&
              password !== ""
            ) {
              createUser({
                userName: userName,
                email: email,
                password: password,
              });
              navigate("/game");
            } else {
              window.alert("Please fill all the forms!");
            }
          }}
        >
          Sign up
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignSelf: "center",
            alignItems: "center",
            marginTop: "10.4vw",
          }}
        >
          <div className="sign-up-have-account">Already have an account?</div>
          <div className="sign-up-sign-in-red"><a href="/signin">Sign in</a></div>
        </div>

        <div style={{ position: "relative", marginTop: "9.06vw" }}>
          <img
            className="sign-up-divider"
            src="images/sign-up/line.png"
            alt=""
          ></img>
          <div className="sign-up-sign-in-blue">Sign in with</div>
        </div>

        <img
          src="images/sign-up/g-plus.png"
          alt=""
          className="g-plus"
          onClick={() => {
            login();
          }}
        />
      </div>
  );
}

export default SignUp;
