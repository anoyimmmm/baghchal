import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const AuthModal = ({ isOpen, onClose }) => {
  const baseHttpUrl = import.meta.env.VITE_BASE_HTTP_URL;
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

  useEffect(() => {
    console.log(auth.guestId);
  }, [auth]);

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

  const handleContinueAsGuest = () => {
    const guestId = crypto.randomUUID();
    setAuth({ isAuthenticated: false, guestId: guestId });
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // signup
      if (mode === "signup") {
        const data = new FormData();
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("first_name", formData.displayName);
        if (formData.avatar) data.append("avatar", formData.avatar);

        await axios.post(`${baseHttpUrl}signup/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage("Signup successful! You can now log in.");
        setMode("login");
      } else {
        // #login
        const response = await axios.post(`${baseHttpUrl}login/`, {
          username: formData.username,
          password: formData.password,
        });
        setMessage("Login successful!");
        const userData = response.data.user_data;
        setAuth({ user: userData, isAuthenticated: true });
        console.log(userData);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-auto border border-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{mode === "login" ? "🔐" : "👤"}</span>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {mode}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Username
            </label>
            <input
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
            />
          </div>

          {mode === "signup" && (
            <>
              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                />
              </div>

              {/* Display Name Field */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Display Name
                </label>
                <input
                  name="displayName"
                  placeholder="How should we call you?"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                />
              </div>

              {/* Avatar Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Profile Picture (Optional)
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-4 border border-gray-300 rounded-xl bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5  duration-200 disabled:transform-none disabled:shadow-lg flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Please wait...</span>
              </>
            ) : (
              <span>{mode === "login" ? "Log In" : "Create Account"}</span>
            )}
          </button>

          {/* if  logged in or has guestId, don't show this button  */}
          {auth.guestId || auth.user ? (
            ""
          ) : (
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium border border-gray-300"
            >
              Continue as Guest
            </button>
          )}

          {/* Message Display */}
          {message && (
            <div
              className={`p-4 rounded-xl text-sm ${
                message.includes("successful")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {message}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-gray-800 hover:text-gray-900 font-medium hover:underline transition-colors"
                  >
                    Sign up here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-gray-800 hover:text-gray-900 font-medium hover:underline transition-colors"
                  >
                    Log in here
                  </button>
                </>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
