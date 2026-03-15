import React, { useContext } from 'react'
import { PageContext } from '../pageContext'

const NewUser = () => {
  const setPageContext = useContext(PageContext);
  return (
    <div className='fullScreen grid place-items-center bg-yellow-100'>
      <div className='bg-white border-2 w-full max-w-72 flex flex-col items-center border-black rounded-2xl p-2'>
        <h1 className='font-bold text-xl'>Chat Group</h1>
        <div className='mb-3'>
          <span className='border border-black bg-green-400 rounded-full w-2 h-2 inline-block mr-2'></span>
          <span>Many users</span>
        </div>
        <button className='w-full bg-pink-400 font-bold py-1 rounded-[10px] border-2 border-black' onClick={() => setPageContext("entername")}>Join Chat</button>
      </div>
    </div>
  )
}

export default NewUser