import { useState, useEffect } from "react";
import "./App.css";
import Game from "./components/Game";
import Layout from "./components/Layout";
// import home from
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserProfile from "./routes/UserProfile";
import Home from "./routes/Home";
import { AuthContext } from "./context/AuthContext";
import {
  WebSocketContext,
  WebSocketProvider,
} from "./context/WebSocketContext";

const initialAuth = JSON.parse(localStorage.getItem("auth")) || {
  isAuthenticated: false,
};

function App() {
  const [auth, setAuth] = useState(initialAuth);

  useEffect(() => {
    if (auth.user) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext value={{ auth, setAuth }}>
      <Router>
        <WebSocketProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="user" element={<UserProfile />} />
              <Route path="game" element={<Game />} />
            </Route>
          </Routes>
        </WebSocketProvider>
      </Router>
    </AuthContext>
  );
}

export default App;
