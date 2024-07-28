import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import useGetHistory from '../hooks/useGetHistory';
import { Link } from 'react-router-dom';


const Profile = () => {
  const user = useSelector((state) => state.userReducer?.authUser?.user);
  const { loading, error, history } = useGetHistory();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div
            className={`relative flex items-center justify-center p-6 ${user.coverImage ? 'h-48' : 'bg-blue-500'}`}
            style={{ backgroundImage: user.coverImage ? `url(${user.coverImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            {!user.coverImage && (
              <div className="absolute inset-0 bg-blue-500 opacity-50"></div>
            )}
            <div className="relative z-10 flex items-center space-x-6">
              <img
                className="w-24 h-24 rounded-full object-cover border-4 border-white"
                src={user.avatar}
                alt={`${user.fullName}'s avatar`}
              />
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-gray-300">@{user.userName}</p>
              </div>
            </div>
          </div>
          <div className="p-6 text-white">
            <h3 className="text-xl font-semibold">Watch History</h3>
            {user.watchHistory.length > 0 ? (
              <div className="overflow-x-auto pb-3 my-4 border-b-2 border-gray-300 custom-scrollbar">
                <div className="flex gap-6">
                  {history.map((video) => (
                    <div
                      key={video._id}
                      className="w-[250px] flex-shrink-0 relative bg-gray-700 rounded-lg shadow-lg overflow-hidden border-2 border-gray-700 hover:border-blue-500 transform transition-all duration-300"
                    >
                      <video
                        src={video.videoFile}
                        className="object-cover cursor-pointer w-full h-30"
                        controls={false}
                      />
                      <div className="p-4">
                        <div className="p-2 rounded-t">
                          <div className="flex justify-between">
                            <p className="text-md truncate">{video.title}</p>
                            <span className="text-md">{video.views} views</span>
                          </div>
                        </div>
                        <div className="flex cursor-pointer items-center mt-2">
                          <img
                            src={video.owner.avatar}
                            alt={video.owner.userName}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span className="text-sm">{video.owner.userName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mt-4">No watch history available.</p>
            )}
            {user.isCreater && (
              <div className="mt-4 flex flex-col space-y-4">
                <Link
                  to='/yourVideos'
                  className="text-xl font-semibold pb-4 text-white border-b-2 border-gray-300 hover:text-blue-300"
                >
                  Your Videos
                </Link>
                <Link
                  to='/yourFollowers'
                  className="text-xl font-semibold pb-4 text-white border-b-2 border-gray-300 hover:text-blue-300"
                >
                  Your Followers
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
