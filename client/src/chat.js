import { useEffect, useRef, useState } from 'react';
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
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();
  const videoGrid = useRef(null);

  useEffect(() => {
    if (RoomId) {
      const mypeer = new Peer();
      mypeer.on("open", id => {
        socket.emit("join-room", RoomId, id);        
      });
      socket.connect();

      const addVideo = (stream) => {
        const video = document.createElement('video');
        video.muted = true;
        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
          video.play();
        });
        videoGrid.current.append(video);
      };

      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      }).then(stream => {
        setStream(stream);
        addVideo(stream);

        mypeer.on('call', call => {
          call.answer(stream);
          call.on('stream', userVideoStream => {
            addVideo(userVideoStream);
          });
        });

        socket.on('user-connected', (userId) => {
          console.log("User connected:", userId);
          const call = mypeer.call(userId, stream);
          call.on("stream", userVideoStream => {
            addVideo(userVideoStream);
          });
          setUserId(userId);
        });
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
          <Route path='/:room' element={<Room setRoomId={setRoomId} videoGrid={videoGrid} />} />
          <Route path='/' element={<Home handleRoom={handleRoom} />} />
        </Routes>
        <div ref={videoGrid} className="videoGrid"></div>
      </div>
    </div>
  );
}

export default App;
