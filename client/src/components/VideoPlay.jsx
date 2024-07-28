import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/userSlice';


const VideoPlay = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.userReducer?.authUser?.user);
  const viewCountIncremented = useRef(false);

  useEffect(() => {
    axios.get(`/video/findVideo/${id}`)
      .then(res => {
        const sortedComments = res.data?.video?.comments?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setVideo({ ...res.data.video, comments: sortedComments });
        setLoading(false);
        viewCountIncremented.current = false;
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    let timer;
    if (video && video.duration && !viewCountIncremented.current) {
      timer = setTimeout(() => {
        axios.get(`/video/incCount/${id}`)
          .then(() => {
            viewCountIncremented.current = true;
          })
          .catch(err => console.error(err));
      }, (video.duration * 1000) / 4);
    }
    return () => clearTimeout(timer);
  }, [video, id]);

  useEffect(() => {
    if (authUser) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [authUser]);

  const handleClick = async (id) => {
    await axios
      .get(`/subscription/subscribe/${id}`)
      .then(res => {
        dispatch(setAuthUser(res?.data));
      })
      .catch(err => console.error(err));
  };

  const isFollowing = () => {
    return authUser?.subscriptions?.some(subscription => subscription.channel === video?.owner?._id);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/comment/addComment/${video._id}`, { comment: newComment }, { withCredentials: true });
      const newCommentData = res.data.newComment;
      setVideo((prevVideo) => ({
        ...prevVideo,
        comments: [newCommentData, ...prevVideo.comments]
      }));
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      {loading ? (
        <div className="flex items-center justify-center h-screen bg-gray-900">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
            <span className="absolute inset-0 flex items-center justify-center text-xl text-white">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start p-6 ml-64 mt-5 space-y-4 text-white">
          {video && (
            <div className="flex flex-col items-center w-full">
              <video controls autoPlay className="w-full h-[32rem] cursor-pointer rounded-md">
                <source src={video?.videoFile} />
                Your browser does not support the video tag.
              </video>
              <div className="w-full p-4 bg-gray-800 rounded-md">
                <h1 className="text-2xl font-semibold text-left">{video.title}</h1>
                <div className="flex justify-between items-center mt-2">
                  <div className='flex items-center'>
                    <img className="w-10 h-10 rounded-full mr-3" src={video?.owner?.avatar} alt="owner img" />
                    <h3 className="text-lg font-medium">{video?.owner?.userName}</h3>
                  </div>
                  <div>
                    <button
                      className={`mt-1 px-3 py-1 rounded text-white ${isFollowing() ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                      onClick={() => handleClick(video?.owner?._id)}
                    >
                      {isFollowing() ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-gray-400 text-left">{video.description}</p>
              </div>
              <div className="w-full p-4 bg-gray-800 rounded-md mt-4">
                <h2 className="text-2xl text-center font-semibold mb-4">Comments</h2>
                {authUser && (
                  <form onSubmit={handleCommentSubmit} className="w-full mb-4 flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-grow p-2 rounded bg-gray-700 text-white"
                      placeholder="Add a comment..."
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white">
                      Submit
                    </button>
                  </form>
                )}
                {video.comments?.map((comment) => (
                  <div key={comment._id} className="flex items-start mb-4">
                    <img className="w-10 h-10 rounded-full mr-3" src={comment?.user?.avatar} alt="comment user img" />
                    <div>
                      <h3 className="text-lg text-gray-400 font-medium">{comment?.user?.userName}</h3>
                      <p className="">{comment.comment}</p>
                      <p className="text-gray-500 text-sm">{new Date(comment.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default VideoPlay;
