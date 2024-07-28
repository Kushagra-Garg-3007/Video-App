import { useState, useEffect } from "react";
import axios from "axios";

const useGetVideos = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      await axios
        .get(`/video/getVideos`)
        .then((res) => {
          setVideos(res.data.videos);
        })
        .catch(err => {
          setVideos([]);
          setError(res?.data?.message || "Error while getting watch history");
          console.error(err)
        });
      setLoading(false);
    }
    fetchVideos();
  }, [])
  return { loading, error, videos };
};
export default useGetVideos;