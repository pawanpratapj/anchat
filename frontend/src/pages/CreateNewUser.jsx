import React, { useContext, useState } from 'react'
import { PageContext } from '../pageContext';
import { socket } from '../socket';

const CreateNewUser = ({ setUsername }) => {
  const [userInput, setUserInput] = useState('');
  const setPageContext = useContext(PageContext);

  return (
    <div className='fullScreen grid place-items-center bg-yellow-100 '>
      <div className='bg-white border-2 w-full max-w-72  border-black rounded-2xl p-3'>
        <h1 className='font-bold text-xl text-center'>Enter details:</h1>
        <input type="text" onChange={(e) => setUserInput(e.target.value)} value={userInput} placeholder='Add a username 😋' className='border-2 mt-5 border-black w-full rounded-[10px] py-1 px-3' />
        <button className='w-full bg-green-400 font-bold py-1 mt-2 rounded-[10px] border-2 border-black' onClick={() => { setUsername(userInput); setPageContext("chatroom"); }}>Join Chat</button>
      </div>
    </div>
  )
}

export default CreateNewUser