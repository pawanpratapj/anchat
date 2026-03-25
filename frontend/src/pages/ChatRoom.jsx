import React, { useEffect, useState, useRef } from 'react'
import { socket } from '../socket';
import OnlineUsers from '../components/OnlineUsers';
import SendIcon from '../assets/SendIcon';
import { isOnlyEmojis } from '../components/emojiCheck';

const ChatRoom = ({ username }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [usersTyping, setUsersTyping] = useState([]);
  const typingTimeout = useRef(null);
  const chatParentRef = useRef(null);

  useEffect(() => {
    chatParentRef.current.scrollTop = chatParentRef.current.scrollHeight;
  }, [messageList]);

  const handleSendMessage = () => {
    socket.emit("typing_off", username);
    if (inputMessage == "") return;
    setMessageList(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.sender == username) {
        return prev.map((elem, index) => {
          if (index != prev.length - 1) {
            return elem;
          } else {
            return { message: [...elem.message, inputMessage], sender: username }
          }
        })
      } else {
        return [...prev, { message: [inputMessage], sender: username }]
      }
    }

    );
    socket.emit("message", { message: inputMessage, sender: username });
    setInputMessage("");
  }

  useEffect(() => {

    const addMessageInList = (msg) => {
      // setMessageList((prev) => [...prev, { message: msg.message, sender: msg.sender }]);

      setMessageList(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.sender == msg.sender) {
          return prev.map((elem, index) => {
            if (index != prev.length - 1) {
              return elem;
            } else {
              return { message: [...elem.message, msg.message], sender: lastMessage.sender }
            }
          })
        } else {
          return [...prev, { message: [msg.message], sender: msg.sender }]
        }
      })

    }

    const addTypingUser = (users) => {
      setUsersTyping(users.filter(elem => elem != username));
    }


    socket.on("message", addMessageInList);
    socket.on("typinguser", addTypingUser)
    return () => {
      socket.off("message", addMessageInList)
      socket.off("typinguser", addTypingUser)

    };
  }, []);

  const handleKeyDown = (key) => {
    if (key != "Enter") {

      socket.emit("typing_on", username);
      if (typingTimeout.current != undefined) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socket.emit("typing_off", username);
      }, 1000);
    }
  }

  return (
    <div className='fullScreen grid place-items-center bg-yellow-100 relative md:px-3 md:py-7'>
      <div className='absolute bg-white hover:bg-black/5 right-2 top-2 px-3 py-1 rounded-md hidden md:inline'>@{username}</div>
      <div className='bg-white  md:border-2 w-full md:max-w-xl  border-black rounded-2xl h-full flex flex-col'>
        <div className='flex items-center border-b-2 justify-between h-10 px-3'>
          <h1 className='font-bold text-xl'>Chat Room</h1>
          <OnlineUsers />
        </div>
        <div className=' p-3 font-mono  cRCParent overflow-y-scroll' ref={chatParentRef}>
          {messageList.map(elem => elem.sender == username ? <SentMessage messagesList={elem.message} key={elem.message.join(" ")} /> : <RecievedMessage sender={elem.sender} key={elem.message.join(" ")} messagesList={elem.message} />)}
        </div>
        {usersTyping.length > 0 && <div className='text-sm px-2 typingAnim'>{usersTyping.join(", ")} are typing...</div>}

        <div className='flex items-center md:p-1 p-2 '>
          <input type="text" value={inputMessage} onKeyDown={(e) => { if (e.key == "Enter") { handleSendMessage() }; handleKeyDown(e.key) }} onChange={(e) => setInputMessage(e.target.value)} placeholder='Enter message' className='flex-1 md:px-3 pl-4 border-2 md:py-1.5 py-2 md:rounded-l-xl rounded-l-3xl' />
          <button className='bg-green-300 h-full px-2 font-bold md:rounded-r-xl border-2 rounded-r-3xl  md:rounded-l-none border-l-0' onClick={handleSendMessage}><SendIcon /></button>
        </div>
      </div>
    </div>
  )
}

const RecievedMessage = ({ sender, messagesList }) => {
  const time = new Date().toLocaleString();

  return (
    <div className="messageParent max-w-4/5 mb-2">
      <p className='text-[12px] mb-1'>@{sender}</p>
      {messagesList.map((elem, index) => (isOnlyEmojis(elem.trim()) ? <div className='text-4xl my-0.5'>{elem}</div> : <div title={time} className={'border-2 mb-0.5 bg-red-100 w-fit px-3 py-1 rounded-r-2xl ' + (index == 0 ? 'rounded-tl-2xl' : '') + (index == messagesList.length - 1 ? ' rounded-bl-2xl' : '')}>{elem}</div>))}
    </div>
  )
}

const SentMessage = ({ sender, messagesList }) => {
  const time = new Date().toLocaleString();
  return (
    <div className='w-full flex justify-end'>
      <div className="messageParent max-w-4/5 mb-2 flex flex-col items-end-safe">

        {messagesList.map((elem, index) => (isOnlyEmojis(elem.trim()) ? <div className='text-4xl my-0.5'>{elem}</div> : <div key={elem + index} title={time} className={' border-2 mb-0.5 bg-blue-100 w-fit px-3 py-1 rounded-l-2xl ' + (index == 0 ? 'rounded-tr-2xl' : '') + (index == messagesList.length - 1 ? ' rounded-br-2xl' : '')}>{elem}</div>))}
      </div>
    </div>
  )
}


export default ChatRoom