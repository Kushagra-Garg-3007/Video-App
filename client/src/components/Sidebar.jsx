import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const navigateTo = useNavigate();
  const authUser = useSelector((state) => state.userReducer?.authUser?.user);
  const [sidebarTop, setSidebarTop] = useState('top-17');

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 17) {
        setSidebarTop('top-0');
      } else {
        setSidebarTop('top-17');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed left-0 z-20 h-full w-64 bg-gray-800 border-r-2 border-gray-700 text-white p-6 ${sidebarTop} transition-top duration-300 ease-in-out`}>

      {authUser ? (
        <ul className="space-y-4">
          <li>
            <Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-700 hover:text-gray-300">Profile</Link>
          </li>
          <li>
            <Link to="/watchHistory" className="block px-4 py-2 rounded hover:bg-gray-700 hover:text-gray-300">Watch History</Link>
          </li>
          {
            authUser.isCreater && <li>
              <Link to="/uploadVideo" className="block px-4 py-2 rounded hover:bg-gray-700 hover:text-gray-300">Upload Videos</Link>
            </li>
          }
          {
            authUser.isCreater && <li>
              <Link to='/yourVideos' className="block px-4 py-2 rounded hover:bg-gray-700 hover:text-gray-300">Your Videos</Link>

            </li>
          }
          {
            authUser.isCreater && <li>
              <Link to='/yourFollowers' className="block px-4 py-2 rounded hover:bg-gray-700 hover:text-gray-300">Your Followers</Link>

            </li>
          }
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-white mb-4">Please login first</p>
          <Link to="/login" className="text-gray-300 hover:text-white px-4 py-2 rounded transition duration-300 ease-in-out bg-gray-700 hover:bg-gray-600">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
