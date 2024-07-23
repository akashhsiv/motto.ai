import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Register } from "./components/Register";

import RequireAuth from "@auth-kit/react-router/RequireAuth";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path={"/"}
          element={
            <RequireAuth fallbackPath={"/login"}>
              <Home />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
