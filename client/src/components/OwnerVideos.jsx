import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { ArrowRight } from 'lucide-react';

const OwnerVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [formData, setFormData] = useState({
    thumbnail: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (editVideo) {
      setFormData({
        thumbnail: editVideo.thumbnail || '',
        title: editVideo.title || '',
        description: editVideo.description || '',
      });
    }
  }, [editVideo]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/video/ownerVideo`);
        setVideos(res.data.ownerVideo);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch videos.');
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      let cnfrm=confirm("Are you sure you want to delete it");
      if(cnfrm){
        const res = await axios.post(`video/deleteVideo/${id}`);
        setVideos(videos.filter((video) => video._id !== id));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to delete video.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (video) => {
    setShowForm(true);
    setEditVideo(video);
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`video/editVideo/${editVideo._id}`, formData, { withCredentials: true });
      console.log(res.data);
      setLoading(false);
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === editVideo._id ? { ...video, ...formData } : video
        )
      );
      setShowForm(false);
      setFormData({
        thumbnail: '',
        title: '',
        description: '',
      });
    } catch (error) {
      setLoading(false);
      const errMsg = error.response?.data?.message || "Error while editing video";
      setError(errMsg);
      console.error(errMsg);
    }
    console.log(`video/editVideo/${editVideo._id}`);
  };

  return (
    <>
      <Navbar />
      <div className="p-4 min-h-screen bg-gray-800">
        <h1 className="text-center text-3xl font-medium my-4 text-white">Your Videos</h1>
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
          videos.length === 0 ? (
            <h1 className='text-center font-semibold text-2xl text-white'>No Video Found, Please Upload Video</h1>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div
                  key={video._id}
                  className="relative bg-black rounded-lg shadow-lg overflow-hidden border-2 cursor-pointer border-black hover:border-blue-500 transform hover:scale-105 transition-all duration-300"
                >
                  <video
                    src={video.videoFile}
                    className="object-cover w-full h-40"
                    controls={false}
                  />
                  <div className="p-2">
                    <div className="p-2 rounded-t">
                      <div className="flex justify-between">
                        <p className="text-md truncate text-white">{video.title}</p>
                        <span className="text-md text-white">{video.views} views</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between p-2">
                    <button
                      className="bg-red-600 text-white py-1 px-2 rounded"
                      onClick={() => handleDelete(video._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="bg-green-500 text-white py-1 px-2 rounded"
                      onClick={() => handleEdit(video)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white w-[400px] p-8 rounded-lg text-black">
            <h1 className="text-2xl text-center font-semibold mb-4">Edit Your Video</h1>
            {error && (
              <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
                {error}
              </div>
            )}
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="thumbnail">
                  Enter Thumbnail
                </label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  type="text"
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="title">
                  Enter Title
                </label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="desc">
                  Enter Description
                </label>
                <input
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  type="text"
                  id="desc"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
            </form>
            <div className="flex justify-between">
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none"
                onClick={handleSubmit}
              >
                Submit <ArrowRight className="ml-2" size={16} />
              </button>
              <button
                className='bg-red-600 text-white py-1 px-2 rounded'
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerVideos;
