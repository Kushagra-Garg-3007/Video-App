import React from 'react';
import useGetVideos from '../hooks/useGetVideos';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Home = () => {
  const { loading, videos } = useGetVideos();
  const navigateTo = useNavigate();
  const user = useSelector((state) => state.userReducer?.authUser?.user);

  const handleClick = (id) => {
    user && axios.get(`/user/addWatchHistory/${id}`);
    navigateTo(`/VideoPlay/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 ml-64 mt-16">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl text-white">
                  Loading...
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="relative bg-black rounded-lg shadow-lg overflow-hidden border-2 border-black hover:border-blue-500 transform hover:scale-105 transition-all duration-300"
                >
                  <video
                    src={video.videoFile}
                    className="object-cover w-full h-40 cursor-pointer"
                    controls={false}
                    onClick={() => handleClick(video._id)}
                  />
                  <div className="p-2">
                    <div className="p-2 rounded-t">
                      <div className="flex justify-between">
                        <p className="text-md truncate text-white">{video.title}</p>
                        <span className="text-md text-white">{video.views} views</span>
                      </div>
                    </div>
                    <div className="flex items-center cursor-pointer mt-2">
                      <img
                        src={video.owner.avatar}
                        alt={video.owner.userName}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-sm text-white">{video.owner.userName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
