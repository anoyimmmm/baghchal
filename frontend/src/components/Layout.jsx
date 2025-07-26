import { useState } from "react";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="flex h-screen w-screen p-5 ">
      <SideBar />
      <div className="flex h-full w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;

function SideBar() {
  const [user, setUser] = useState("USER1");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLoginToggle = () => {
    if (isLoggedIn) {
      setUser("Guest");
      setIsLoggedIn(false);
    } else {
      setUser("USER1");
      setIsLoggedIn(true);
    }
    <div className="text-gray-800 mb-5 font-medium">{user}</div>;
  };

  return (
    <div className="h-full w-50 bg-white border-r  border-gray-300 p-8">
      <div className="text-center mb-8 ">
        <div className="w-15 h-15 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-600 text-2xl font-medium">
          U
        </div>
        <div className="text-gray-800 mb-5 font-medium">{user}</div>
        <button
          onClick={handleLoginToggle}
          className="bg-gray-600 text-white border-none px-4 py-2 rounded cursor-pointer hover:bg-gray-700 transition-colors"
        >
          {isLoggedIn ? "logout" : "login"}
        </button>
      </div>
    </div>
  );
}
