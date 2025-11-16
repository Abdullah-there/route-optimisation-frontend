import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <>
    <nav className='flex justify-between items-center mx-10 h-[9vh]'>
        <h1 className='text-4xl font-bold'>Project</h1>
        <ul className='flex gap-10'>
            <li className='transition-all hover:underline hover:text-xl'><Link href={"/"}>Home</Link></li>
            <li className='transition-all hover:underline hover:text-xl'><Link href={"/playground"}>PlayGround</Link></li>
            <li className='transition-all hover:underline hover:text-xl'><Link href={"/map"}>Map</Link></li>
        </ul>
    </nav>
    <hr className='text-gray-600 h-1'/>
    </>
  )
}

export default Navbar