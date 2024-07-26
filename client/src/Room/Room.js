import React, { useEffect, useState } from 'react'
import './Room.css'
import { useParams } from 'react-router-dom'

const Room = ({setRoomId}) => {
  const { room } = useParams();

  useEffect(() => {
    setRoomId(room);
    console.log(room)
  }, [room]);
  
    
  return (
    <div>
        <div>
            <div>Video</div>
            <div>
                <video src=""></video>
            </div>
        </div>
    </div>
  )
}

export default Room