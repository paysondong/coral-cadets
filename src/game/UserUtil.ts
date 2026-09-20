import { log } from "console";

// Default login retention to 1 day
const TOKEN_RENTENTION = 60 * 60 * 24 * 1000;

export function createUser(user: {
  userName: string;
  email: string;
  password: string;
}) {
  localStorage.setItem("userName", user.userName);
  localStorage.setItem("email", user.email);
  localStorage.setItem("password", user.password);
  localStorage.setItem("loggedInAt", Date.now().toString());
}

export function retrieveUser() {
  const loggedInAt = localStorage.getItem("loggedInAt");

  if (!loggedInAt) {
    return null;
  }

  const deltaTime = Date.now() - parseInt(loggedInAt, 10);
  if (deltaTime > TOKEN_RENTENTION) {
    localStorage.removeItem("loggedInAt");
    return null;
  }

  const userName = localStorage.getItem("userName");
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  if (
    userName !== null &&
    email !== null &&
    password !== null
  ) {
    return {
      userName: userName,
      email: email,
      password: password,
    };
  } else {
    return null;
  }
}


export function signIn(username: string, password: string) {
  const storedUserName = localStorage.getItem("userName");
  const storedPassword = localStorage.getItem("password");

  if (username === storedUserName && password === storedPassword) {
    localStorage.setItem("loggedInAt", Date.now().toString());
    return retrieveUser();
  }

  return null;
}