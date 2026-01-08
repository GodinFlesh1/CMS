import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
    
        <div className='text-2xl font-bold justify-center items-center'>
            <p>Welcome to the CMS</p>
            <p>Please login to continue or signup to create an account</p>
        </div>
        <div>
            <Link to="/login" className='text-blue-500'><button className='bg-blue-500 text-white px-4 py-2 rounded-md m-2'>Login</button></Link>
            <Link to="/signup" className='text-blue-500'><button className='bg-blue-500 text-white px-4 py-2 rounded-md m-2'>Signup</button></Link>
        </div>
        
    </div>
  )
}

export default Home