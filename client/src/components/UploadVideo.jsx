import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from './Navbar';

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    thumbnail: '',
    title: '',
    description: '',
    video: null
  });

  const navigateTo = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === "video") {
      const file = files?.[0];
      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const response = await axios.post(`/video/uploadVideo`, formDataToSend, { withCredentials: true });
      console.log("Video Uploaded successfully", response.data);
      setLoading(false);
      navigateTo("/home");
    } catch (error) {
      setLoading(false);
      console.error("Error uploading video", error);
      setErrorMessage(error?.response?.data?.message || "Uploadation failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-[90vh] flex items-center justify-center bg-gray-900 border-t-2">
        {loading ? (
          <div className="relative">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
              <span className="absolute text-xl text-white">Loading...</span>
            </div>
          </div>
        ) : (
          <section className="w-full max-w-md">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
              <h2 className="text-center text-2xl font-bold text-white mb-4">Upload Videos</h2>
              {errorMessage && <p className="text-center text-red-600 mb-6">{errorMessage}</p>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="thumbnail"
                    value={formData.thumbnail}
                    onChange={handleInputChange}
                    placeholder="Enter Thumbnail For Your Video"
                    required
                  />
                </div>
                <div>
                  <input
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter Title Of Your Video"
                    required
                  />
                </div>
                <div>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter Description Of Your Video"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="video" className="text-gray-400">Video</label>
                  <input
                    className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="file"
                    name="video"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Upload Video <ArrowRight className="ml-2" size={16} />
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default UploadVideo
