import React from 'react'
import {Link } from 'react-router-dom'
const Dash = () => {
  

return (
  <div>
      <img src='https://roxiler.com/wp-content/uploads/2022/03/Logo.svg' width={300} className='mt-10 mx-auto'/>
    <div className='flex justify-center items-center gap-10 mt-40 '>
      <Link to="/transaction" className='px-10 py-5 bg-red-600 border border-black text-xl font-semibold text-white hover:bg-red-700'>Transactions</Link>
      <Link to="/statistics" className='px-10 py-5 bg-green-400 border border-black text-xl font-semibold text-white hover:bg-green-500'>Statistics</Link>
      <Link to="/barchart" className='px-10 py-5 bg-yellow-300 border border-black text-xl font-semibold text-white hover:bg-yellow-400'>BarChart</Link>
    </div>
  </div>
)
}

export default Dash