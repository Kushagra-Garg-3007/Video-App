import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import UploadVideo from './components/UploadVideo'
import VideoPlay from './components/VideoPlay'
import Profile from './components/Profile'
import WatchHistory from './components/WatchHistory'
import OwnerVideos from './components/OwnerVideos'
import Followers from "./components/Followers"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/uploadVideo' element={<UploadVideo />}></Route>
        <Route path='/VideoPlay/:id' element={<VideoPlay />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/watchHistory' element={<WatchHistory />}></Route>
        <Route path='/yourVideos' element={<OwnerVideos />}></Route>
        <Route path="/yourFollowers" element={<Followers />}></Route>
      </Routes>
    </Router>
  )
}

export default App
