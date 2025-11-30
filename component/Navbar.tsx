"use client"

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session, status} = useSession();

  if (status == "loading") return <p>Loading ...</p>
  return (
    <>
    <nav className='flex justify-between items-center mx-10 h-[9vh]'>
        <h1 className='text-4xl font-bold'>Project</h1>
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
    </nav>
    <hr className='text-gray-600 h-1'/>
    </>
  )
}

export default Navbar