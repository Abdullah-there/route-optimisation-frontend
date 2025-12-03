"use client"

import React from 'react'
import Link from 'next/link'
import { signOut } from "next-auth/react";

const Navbar = (props: any) => {
  const session = props.session;
  
  return (
    <>
    <nav className='flex flex-col justify-between items-center h-[9vh] fixed top-0 bg-white w-full px-10 '>
      <div className='flex justify-between items-center w-full h-[8vh]'>
        <h1 className='text-4xl font-extrabold text-blue-500'>Project</h1>
        <ul className='flex gap-10'>
            <li className='transition-all hover:underline hover:text-xl'><Link href={"/"}>Home</Link></li>
            <li className='transition-all hover:underline hover:text-xl'><Link href={"/playground"}>PlayGround</Link></li>
            <li className='transition-all hover:underline hover:text-xl'><Link href={"/map"}>Map</Link></li>
            {!session && (
              <li className='transition-all hover:underline hover:text-xl bg-blue-500 text-white hover:bg-white hover:text-blue-500 border-2 border-blue-500 px-4 rounded-md'><Link href={"/auth/login"}>Login</Link></li>
            )}
            {session && (
              <button className='transition-all hover:underline hover:text-xl bg-blue-500 text-white hover:bg-white hover:text-blue-500 border-2 border-blue-500 px-4 rounded-md cursor-pointer'
                onClick={() => signOut()}
              >Logout</button>
            )}
        </ul>
        </div>
    <hr className='text-gray-600 h-[1vh]'/>
    </nav>
    <div className='h-[9vh]'></div>
    </>
  )
}

export default Navbar