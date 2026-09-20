import { useState, useEffect } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router";
import { retrieveUser, signIn } from "./UserUtil";
import { useGoogleLogin } from '@react-oauth/google';
import { isMobile } from "react-device-detect";

function SignIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  console.log(process.env);



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

  useEffect(() => {
    const user = retrieveUser();
    if (user !== null) {
      navigate("/game");
    }
  }, []);

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
        <div className="sign-up-title">Sign In</div>
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

      <input
        className="sign-up-form-input"
        placeholder="Username"
        onChange={(event) => {
          setUserName(event.target.value);
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
            password !== ""
          ) {
            const user = signIn(
              userName,
              password,
            );
            if (user) {
              navigate("/game");
            } else {
              window.alert("User name or password is wrong");
            }
          } else {
            window.alert("Please fill all the forms!");
          }
        }}
      >
        Sign In
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
        <div className="sign-up-have-account"> Create a new account </div>
        <div className="sign-up-sign-in-red">
          <a href="/register">Sign up</a>
        </div>
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

export default SignIn;
