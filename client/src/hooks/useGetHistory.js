import { useState, useEffect } from "react";
import axios from "axios";

const useGetHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`/user/getWatchHistory`, { withCredentials: true });
        setHistory(res.data.watchHistory);
      } catch (err) {
        setError('Failed to fetch watch history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return { loading, error, history };
};

export default useGetHistory;
