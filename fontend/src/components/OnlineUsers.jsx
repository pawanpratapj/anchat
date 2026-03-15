import React, { useEffect, useState } from 'react'
import { socket } from '../socket';

const OnlineUsers = () => {
  const [connectedUsers, setConnectedUsers] = useState(0);

  useEffect(() => {


    const setTotalConnectUsers = (numberOfUsers) => {
      setConnectedUsers(numberOfUsers);
      console.log(numberOfUsers)
    }
    socket.on("connectedUsers", setTotalConnectUsers)
    return () => {
      socket.off("connectedUsers", setTotalConnectUsers)
    }

  }, [])
  return (
    <div className=''>
      <span className='border  border-black bg-green-400 rounded-full w-2 h-2 inline-block mr-2'></span>
      <span className='text-sm'>{connectedUsers} Online</span>
    </div>
  )
}

export default OnlineUsers