import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AlignJustify } from "lucide-react";
import axios from "axios";
import { setAuthUser } from "../redux/userSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.userReducer?.authUser?.user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    axios
      .post("/user/logout", {}, { withCredentials: true })
      .then(() => {
        dispatch(setAuthUser(null));
        navigateTo("/login");
      })
      .catch((err) => console.log(err));
  };

  const MobileMenuItem = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="text-gray-300 hover:text-white px-3 py-2 rounded transition cursor-pointer"
    >
      {children}
    </button>
  );

  return (
    <nav className="bg-gray-900 p-4 z-10 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link to="/home" className="flex items-center text-white text-2xl font-bold">
            VideoTube
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          {authUser && (
            <Link to='/profile' className="flex items-center text-white cursor-pointer">
              <img
                src={authUser.avatar}
                alt={authUser.userName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>Hi, {authUser.userName}</span>
            </Link>
          )}
          {authUser ? (
            <MobileMenuItem onClick={handleLogout}>Logout</MobileMenuItem>
          ) : (
            <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded transition">
              Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 focus:outline-none">
            <AlignJustify className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"} mt-4`}>
        <div className="flex flex-col items-start space-y-2">
          {authUser && (
            <Link to='/profile' className="flex items-center text-white">
              <img
                src={authUser.avatar}
                alt={authUser.userName}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span>Hi, {authUser.userName}</span>
            </Link>
          )}
          {authUser ? (
            <MobileMenuItem onClick={() => { handleLogout(); toggleMenu(); }}>Logout</MobileMenuItem>
          ) : (
            <Link
              to="/login"
              className="text-gray-300 hover:text-white px-3 py-2 rounded transition"
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
