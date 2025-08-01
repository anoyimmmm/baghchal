import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthModal from "./AuthModal";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Layout() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <>
      <div className="flex h-screen w-screen bg-gray-50">
        <SideBar setAuthModalOpen={setAuthModalOpen} />
        <div
          className="flex h-full w-full md:p-5 p-0 justify-center overflow-hidden 
        "
        >
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginToggle = () => {
    if (!auth.user) {
      setAuthModalOpen(true);
    } else {
      setAuth({ isAuthenticated: false });
    }
    // Close mobile menu after action
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300 px-4 py-3 flex items-center justify-between">
        {/* Hamburger Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          {/* Hamburger */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Logo/Project Name */}
        <div className="text-xl font-bold text-gray-800 ">BaghChal</div>

        {/* Spacer to center the logo */}
        <div className="w-10"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-50/40 bg-opacity-50 z-40 "
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-full bg-white border-r  border-gray-300 p-8 z-50
          md:relative md:w-50 md:translate-x-0
          fixed w-64 top-0 left-0 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:block
        `}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800"
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

        <div className="text-center mb-8 mt-8 md:mt-0">
          {/* home button  */}
          <div
            className=" text-2xl font-bold text-gray-800 my-5 
          "
            onClick={() => navigate("/")}
          >
            <button>BaghChal</button>
          </div>
          {/* user profile */}
          <div className="w-15 h-15 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 text-2xl font-medium">
            {auth.user?.avatar || "pp"}
          </div>
          <div className="text-gray-800 mb-5 font-bold text-xl">
            {auth.user?.username || "GUEST"}
          </div>

          <div
            className=" text-xl font-bold text-gray-800 
          "
            onClick={() => navigate("rules")}
          >
            <button>RULES</button>
          </div>
          <button
            onClick={handleLoginToggle}
            className="bg-gray-800 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-gray-700 transition-colors "
          >
            {auth.isAuthenticated ? "logout" : "login"}
          </button>
        </div>
      </div>

      {/* Content Spacer for Mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
