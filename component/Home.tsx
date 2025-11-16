import React from 'react'
import Navbar from './Navbar'

const Home = () => {
  return (
    <>
    <Navbar />
    <div className='flex items-center flex-col justify-center h-[90vh] '>
        <h1 className='text-4xl font-bold'>AI - Powered <span className='text-blue-400 '>Route Optimisation</span> With Traffic Simulation</h1>
        <p></p>    
    </div>
    </>
  )
}

export default Home