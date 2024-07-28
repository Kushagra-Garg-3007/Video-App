import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';

const Followers = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/subscription/getSubscribers`)
      .then(res => {
        setFollowers(res?.data?.subscribers);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error(err)
      });
  }, [])


  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      {loading ?
        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <span className="absolute text-xl text-white">Loading...</span>
          </div>
        </div> :
        (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Your Followers</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followers.map((follower) => (
                <div
                  key={follower._id}
                  className="relative rounded-lg shadow-md p-6 flex flex-col items-center bg-white text-black"
                  style={{ backgroundColor: follower.coverImage ? 'transparent' : 'white', color: follower.coverImage ? 'white' : 'black' }}>
                  {follower.coverImage && (
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 rounded-lg"
                      style={{ backgroundImage: `url(${follower.coverImage})` }}></div>
                  )}
                  <img
                    src={follower.avatar}
                    alt="follower's image"
                    className="w-24 h-24 rounded-full mb-4 relative z-10 border-2 border-black"
                  />
                  <h3 className="text-xl font-semibold relative z-10">{follower.userName}</h3>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  )
}

export default Followers
