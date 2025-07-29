import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthModal from "./AuthModal";
import { AuthContext } from "../context/AuthContext";

function Layout() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen w-screen p-5 ">
        <SideBar setAuthModalOpen={setAuthModalOpen} />
        <div className="flex h-full w-full">
          <Outlet context={setAuthModalOpen} />
        </div>
      </div>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}

export default Layout;

function SideBar({ setAuthModalOpen }) {
  const { auth, setAuth } = useContext(AuthContext);

  const handleLoginToggle = () => {
    if (!auth.user) {
      setAuthModalOpen(true);
    } else {
      setAuth({ isAuthenticated: false });
    }

    // <div className="text-gray-800 mb-5 font-medium">{auth.user}</div>;
  };

  return (
    <div className="h-full w-50 bg-white border-r  border-gray-300 p-8">
      <div className="text-center mb-8 ">
        <div className="w-15 h-15 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 text-2xl font-medium">
          {auth.user?.avatar || "pp"}
        </div>
        <div className="text-gray-800 mb-5 font-bold">
          {auth.user?.username || "GUEST"}
        </div>
        <button
          onClick={() => handleLoginToggle()}
          className="bg-gray-800 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
        >
          {auth.isAuthenticated ? "logout" : "login"}
        </button>
      </div>
    </div>
  );
}
