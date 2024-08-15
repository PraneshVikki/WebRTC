import React, { useEffect, useState } from 'react'
import './Room.css'
import { useParams } from 'react-router-dom'

const Room = ({setRoomId,videoGrid}) => {
  const { room } = useParams();
console.log(videoGrid)
  useEffect(() => {
    setRoomId(room);
    console.log(room)
  }, [room]);
  
    
  return (
    <div>
        <div>Video</div>
        <div className='videoGrid' ref={videoGrid}></div>
    </div>
  )
}

export default Room