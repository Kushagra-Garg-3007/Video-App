import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/userSlice";

function Login() {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      console.log(formData);
      const response = await axios.post("/user/login", formData, { withCredentials: true });
      if (response) {
        setLoading(false);
        dispatch(setAuthUser(response.data));
        navigateTo("/home");
      }
    } catch (error) {
      setLoading(false);
      const data = error?.response?.data;
      if (data === "invalid username or password" || data === "user not found") {
        alert(data);
      } else {
        console.log("Error while submitting form:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
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
            <h2 className="text-center text-4xl font-bold text-white mb-4">Login</h2>
            <p className="text-center text-gray-400 mb-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-400 hover:underline"
              >
                Create a free account
              </Link>
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter Your Username"
                  required
                />
              </div>
              <div>
                <input
                  className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Your Password"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Login <ArrowRight className="ml-2" size={16} />
                </button>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}

export default Login;
