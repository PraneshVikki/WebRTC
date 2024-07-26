import React from 'react'

const Home = ({handleRoom}) => {

    
  return (
    <div>
        <button onClick={handleRoom}>Create room</button>
    </div>
  )
}

export default Home