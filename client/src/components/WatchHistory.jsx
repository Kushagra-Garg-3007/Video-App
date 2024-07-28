import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import useGetHistory from '../hooks/useGetHistory.js';

const WatchHistory = () => {
  const { loading, error, history } = useGetHistory();

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 ml-64 ">
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
            <div>
              <h1 className='text-white text-center text-3xl font-semibold'>Your History</h1>
              {history.length == 0 ? <h1 className='text-white text-center text-2xl'> NO WATCH HISTORY </h1> :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                  {history.map((video) => (
                    <div
                      key={video._id}
                      className="relative bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-black hover:border-blue-500 transform hover:scale-105 transition-all duration-300"
                    >
                      <video
                        src={video.videoFile}
                        className="object-cover cursor-pointer w-full h-40"
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
                        <div className="flex cursor-pointer items-center mt-2">
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
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchHistory;
