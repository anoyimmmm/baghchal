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
        <div className="text-xl font-bold text-gray-800">BaghChal</div>

        {/* Spacer to center the logo */}
        <div className="w-10"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          h-full bg-white border-r border-gray-300 z-50 flex flex-col
          md:relative md:w-64 md:translate-x-0
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

        {/* Top Section */}
        <div className="flex-1 p-8">
          {/* Logo/Home Button */}
          <div className="text-center mb-8 mt-8 md:mt-0">
            <button
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
              className="text-2xl font-bold text-gray-800 mb-6 hover:text-gray-600 transition-colors"
            >
              BaghChal
            </button>
          </div>

          {/* User Profile Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 text-xl font-medium">
              {auth.user?.username?.[0]?.toUpperCase() || "G"}
            </div>

            <div className="text-gray-800 font-bold text-lg mb-6">
              {auth.user?.username || "GUEST"}
            </div>

            {/* Navigation */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigate("/rules");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-gray-800 font-medium hover:text-gray-600 transition-colors"
              >
                RULES
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Login/Logout Button */}
        <div className="p-8 border-t border-gray-300">
          <button
            onClick={handleLoginToggle}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors font-medium"
          >
            {auth.isAuthenticated ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Content Spacer for Mobile */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
