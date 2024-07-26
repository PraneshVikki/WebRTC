import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Room from './Room/Room.js';
import Home from './Home/Home.js';
import { io } from 'socket.io-client';
import { Peer } from "peerjs";

const socket = io("http://localhost:3001", {
  autoConnect: false
});

function App() {
  const [RoomId, setRoomId] = useState(null);
  const [UserId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (RoomId) {

      const mypeer = new Peer();

      mypeer.on("open",id =>{
        console.log(id)
        socket.emit("join-room", RoomId, id);
        
      })
      socket.connect();

      socket.on('user-connected', (userId) => {
        console.log("User connected:", userId);
        setUserId(userId);
      });

      return () => {
        socket.off('user-connected');
        socket.disconnect();
      };
    }
  }, [RoomId]);

  const handleRoom = () => {
    axios.get("http://localhost:3001").then((response) => {
      setRoomId(response.data);
      console.log(response.data);
      navigate(`/${response.data}`);
    });
  };

  return (
    <div className="App">
      <div>
        <Routes>
          <Route path='/:room' element={<Room setRoomId={setRoomId}/>} />
          <Route path='/' element={<Home handleRoom={handleRoom} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
