import React, { useEffect, useState } from 'react'
import './Room.css'
import { useParams } from 'react-router-dom'

const Room = ({setRoomId,videoGrid,handleChangeSize,handleStart,handleStop,handlePlay,handleMessages,tempMess}) => {
  const { room } = useParams();
  useEffect(() => {
    setRoomId(room);
  }, [room]);
  


    
  return (
    <div className='room'>
      <div>
        <div>Video</div>
        <div>
          <h3>Screen sizing</h3>
          <form action="" onSubmit={handleChangeSize}>
            <label htmlFor="videoWidth">Width</label>
            <input type="number" id='videoWidth' />
            <label htmlFor="videoHeight">Height</label>
            <input type="number" id='videoHeight'/>
            <button type='submit'>Submit</button>
          </form>
          <div>
            <button onClick={handleStart}>Start Recording</button>
            <button onClick={handleStop}>Stop Recording</button>
            <button onClick={handlePlay}>Play Recording</button>
          </div>
        </div>
        <div className='videoGrid' ref={videoGrid}></div>
        <div>
          <h1>Recorded Video</h1>
          <video id='recorededvideoId'></video>
        </div>
    </div>
    <div>
      <div>Chat Box</div>
      <div>

      </div>
      <form onSubmit={handleMessages}>
        <input type="text"id='textBox' value={tempMess.current} onChange={(e)=>tempMess.current = e.target.value}/>
        <input type="submit"  />
      </form>
      <div id='messageId'>

      </div>
    </div>
    </div>

  )
}

export default Room