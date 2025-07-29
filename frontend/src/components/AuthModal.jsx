import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    displayName: "",
    password: "",
    avatar: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setMessage("");
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("first_name", formData.displayName);
        if (formData.avatar) data.append("avatar", formData.avatar);

        await axios.post("http://localhost:8000/signup/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage("Signup successful! You can now log in.");
        setMode("login");
      } else {
        const response = await axios.post("http://localhost:8000/login/", {
          username: formData.username,
          password: formData.password,
        });
        setMessage("Login successful!");
        const userData = response.data.user_data;
        setAuth({ user: userData, isAuthenticated: true });
        console.log("authenticated");
        onClose();
      }
    } catch (error) {
      const errorMsg = "Error: " + error.response?.data?.error;
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold capitalize">{mode}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-gray-300"
          />

          {mode === "signup" && (
            <>
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded border-gray-300"
              />
              <input
                name="displayName"
                placeholder="Display Name"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full p-2 border rounded border-gray-300"
              />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-600"
              />
            </>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded border-gray-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </button>

          {message && <p className="text-sm text-gray-600">{message}</p>}

          <p className="text-sm text-center mt-2">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-600 hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-600 hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
