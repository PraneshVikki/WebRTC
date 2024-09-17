import { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Room from './Room/Room.js';
import Home from './Home/Home.js';
import { io } from 'socket.io-client';
import { Peer } from 'peerjs';

const socket = io('http://localhost:3001', {
  autoConnect: false,
});

function App() {
  const [RoomId, setRoomId] = useState(null);
  //const width = useRef(780);
  //const height = useRef(780);
  const [UserId, setUserId] = useState({});
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();
  const videoGrid = useRef(null);
  let mediaStream = useRef(null);
  let mediaStreamRecorder = useRef(null);
  let recordBlob = useRef(null);
  const tempMess = useNavigate('');
  let name = useRef('')
  
  /*const handleChangeSize = (e) => {
    e.preventDefault();
    const videos = document.getElementsByTagName('video');  
    for (let video of videos) {
      video.style.width = `${width.current}px`; 
      video.style.height = `${height.current}px`; 
    }
  };
  
  const handleHeight = (e)=>{
    height.current = e.target.value
  }
  const handleWidth= (e)=>{
    width.current = e.target.value
  }*/

    console.log(mediaStream.current);
    //socket.emit('new-user',name)
    useEffect(()=>{
      name.current = prompt("what is ur name");
    },[])
    useEffect(() => {
      if (RoomId) {
        const mypeer = new Peer();
        mypeer.on('open', (id) => {
          UserId[id] = name;
          socket.emit('join-room', RoomId, id,name.current);
        });
        socket.connect();
        
      console.log(name.current)
      const addVideo = (video, stream) => {
        video.muted = true;
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
          video.play();
        });
        videoGrid.current.append(video);
      };

      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      }).then((stream) => {
        mediaStream.current = stream
        console.log(stream)
        console.log(mediaStream.current)
        const constraints = {
          width: { min: 100, ideal: 100 },
          height: { min: 100, ideal: 100 },
        };
        //.applyConstraints(constraints)
        const tracks = stream.getTracks();
        tracks[1].applyConstraints(constraints);
        for (let track in tracks){
          tracks[track].enabled = false;
        }
        const video = document.createElement('video');
        addVideo(video, stream);
        setStream(stream);

        mypeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideo(video, userVideoStream);
          });
        });

        socket.on('user-disconnected', (userId) => {
          if (UserId[userId]) {
            UserId[userId].close();
            const videoElements = videoGrid.current.getElementsByTagName('video');
            for (let video of videoElements) {
              if (video.srcObject === UserId[userId].remoteStream) {
                video.remove();
              }
            }
          }
        });

        socket.on('user-connected', (userId) => {
          const video = document.createElement('video');
          const call = mypeer.call(userId, stream);

          call.on('stream', (userVideoStream) => {
            addVideo(video, userVideoStream);
          });

          call.on('close', () => {
            video.remove();
          });

          setUserId((prev) => ({ ...prev, [userId]: call }));
        });

        window.addEventListener('beforeunload', () => {
          socket.emit('disconnect-user', RoomId, mypeer.id);
        });
      });

      return () => {
        window.removeEventListener('beforeunload', () => {
          socket.emit('disconnect-user', RoomId, mypeer.id);
        });
        socket.off('user-connected');
        socket.off('user-disconnected');
        socket.disconnect();
      };
    }
  }, [RoomId]);

  const handleRoom = () => {
    axios.get('http://localhost:3001').then((response) => {
      setRoomId(response.data);
      navigate(`/${response.data}`);
    });
  };

  const handleStart = ()=>{
    console.log('handleStart')
    recordBlob.current = [];
    mediaStreamRecorder.current = new MediaRecorder(mediaStream.current);
    mediaStreamRecorder.current.ondataavailable = (event) => {
      console.log(event.data)
      recordBlob.current.push(event.data);
    };
    mediaStreamRecorder.current.start()
      
  }
  const handleStop = ()=>{
    mediaStreamRecorder.current.stop()
  }

  const handlePlay = ()=>{
    let superBuffer = new Blob(recordBlob.current);
    console.log(superBuffer);
    console.log(window.URL.createObjectURL(superBuffer))
    let recorededvideoId = document.getElementById('recorededvideoId')
    recorededvideoId.src = window.URL.createObjectURL(superBuffer);
    recorededvideoId.controls = true;
    recorededvideoId.play();
  }

const handleMessages = (e) => {
  e.preventDefault();
  console.log(UserId)

  socket.emit('send-message', tempMess.current); 
  const textBox = document.getElementById('textBox');
  textBox.value = '';
  tempMess.current = '';
};
useEffect(() => {
  socket.on('recive-message', (message) => {
    displayMessage(message);
  });
}, []);
function displayMessage(message) {
  console.log(name.current );
  const div = document.createElement('div');
  div.textContent = `${name.current} : ${message}`;
  document.getElementById('messageId').append(div);  
}


  return (
    <div className="App">
      <div>
        <Routes>
          <Route path='/:room' element={<Room setRoomId={setRoomId} videoGrid={videoGrid} handleStart={handleStart} handleStop={handleStop} handlePlay={handlePlay} handleMessages={handleMessages} tempMess={tempMess}/>} />
          <Route path='/' element={<Home handleRoom={handleRoom} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
