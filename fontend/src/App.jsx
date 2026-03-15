import React, { useEffect, useState } from 'react'
import "./App.css"
import NewUser from './pages/NewUser'
import CreateNewUser from './pages/CreateNewUser'
import ChatRoom from './pages/ChatRoom'
import { PageContext } from './pageContext'
import { socket } from './socket'

const App = () => {
  const [cp, setCp] = useState("home");
  const [username, setUsername] = useState();

  useEffect(() => {
    if (username != undefined) {
      socket.connect();
    }
  }, [username])
  return (
    <PageContext.Provider value={setCp}>
      {cp == "home" ? <NewUser /> : (cp == "entername" ? <CreateNewUser setUsername={setUsername} /> : <ChatRoom username={username} />)}
    </PageContext.Provider>
  )
}

export default App