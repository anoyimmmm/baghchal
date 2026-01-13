import { useState, useContext } from "react";
import BaseModal from "./ui/BaseModal";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import SecondaryButton from "./ui/SecondaryButton";
import PrimaryButton from "./ui/PrimaryButton";

export default function AuthModal({ isOpen, onClose }) {
  const baseHttpUrl = import.meta.env.VITE_BASE_HTTP_URL;
  const [mode, setMode] = useState("login");
  const { auth, setAuth } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    displayName: "",
    password: "",
    avatar: null,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [loading, setLoading] = useState(false);

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
    console.log("Guest ID:", guestId);
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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={(mode === "login" ? "🔐" : "👤") + mode}
    >
      <div className="space-y-6">
        <FormField label="Username">
          <Input
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </FormField>

        {mode === "signup" && (
          <>
            <FormField label="Email Address">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField label="Display Name">
              <Input
                name="displayName"
                placeholder="How should we call you?"
                value={formData.displayName}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Profile Picture (Optional)">
              <Input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
              />
            </FormField>
          </>
        )}

        <FormField label="Password">
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </FormField>

        {/* login/signup button  */}
        <PrimaryButton
          variant="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {mode === "login" ? "Log In" : "Create Account"}
        </PrimaryButton>

        {/* Guestbutton  */}
        {!auth.guestId ? (
          <SecondaryButton onClick={handleContinueAsGuest}>
            Continue as Guest
          </SecondaryButton>
        ) : (
          ""
        )}

        <Alert message={message} type={messageType} />

        <div className="text-center pt-4 border-t border-[#3a3835]">
          <p className="text-gray-400">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-[#f95e5e] hover:text-[#e74c4c] font-semibold hover:underline transition-colors"
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={toggleMode}
                  className="text-[#f95e5e] hover:text-[#e74c4c] font-semibold hover:underline transition-colors"
                >
                  Log in here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </BaseModal>
  );
}

const Input = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required,
  accept,
  className = "",
}) => {
  const baseClasses =
    "w-full p-4 bg-[#1a1a1a] border border-[#3a3835] rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#f95e5e] transition-all";

  if (type === "file") {
    return (
      <input
        type="file"
        name={name}
        accept={accept}
        onChange={onChange}
        className={`${baseClasses} file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#3a3835] file:text-gray-300 hover:file:bg-[#454240] file:cursor-pointer cursor-pointer ${className}`}
      />
    );
  }

  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`${baseClasses} ${className}`}
    />
  );
};

const FormField = ({ label, children }) => (
  <div>
    <label className="block text-gray-300 font-semibold mb-2 text-sm">
      {label}
    </label>
    {children}
  </div>
);

const Alert = ({ message, type = "error" }) => {
  if (!message) return null;

  const styles = {
    success: "bg-green-900/30 text-green-300 border border-green-800",
    error: "bg-red-900/30 text-red-300 border border-red-800",
  };

  return (
    <div className={`p-4 rounded-lg text-sm ${styles[type]}`}>{message}</div>
  );
};
