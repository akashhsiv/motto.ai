import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AuthProvider from "react-auth-kit/AuthProvider";
import createStore from "react-auth-kit/createStore";
import { ThemeProvider } from "@mui/material";
import theme from "./Theme";

const store = createStore({
  authName: "_auth",
  authType: "cookie",
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === "https:",
});
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <AuthProvider store={store}>
      <App />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
