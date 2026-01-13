import { useState, useEffect } from "react";
import "./App.css";
import Game from "./routes/Game";
import Layout from "./routes/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserProfile from "./routes/UserProfile";
import Home from "./routes/Home";
import { AuthContext } from "./context/AuthContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import Rules from "./routes/Rules";
import AuthModal from "./components/AuthModal";

const initialAuth = JSON.parse(localStorage.getItem("auth")) || {
  isAuthenticated: false,
};

function App() {
  const [auth, setAuth] = useState(initialAuth);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // if logged in or guestid saved, save it to browser
    if (auth.user || auth?.guestId) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      //else prompt login with option to continue as guest
      setAuthModalOpen(true);
    }
  }, [auth]);

  // Create the router configuration
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <WebSocketProvider>
          <Layout setAuthModalOpen={setAuthModalOpen} />
        </WebSocketProvider>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "user",
          element: <UserProfile />,
        },
        {
          path: "game/:gameId",
          element: <Game />,
        },
        {
          path: "rules",
          element: <Rules />,
        },
      ],
    },
  ]);

  return (
    <AuthContext value={{ auth, setAuth }}>
      <RouterProvider router={router} />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </AuthContext>
  );
}

export default App;
