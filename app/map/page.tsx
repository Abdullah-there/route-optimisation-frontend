"use client"

import React from 'react'
import Navbar from '@/component/Navbar'
import { useSession } from 'next-auth/react'

const page = () => {
  const { data: session, status } = useSession();

  if (status == "loading") return <p className="text-2xl font-bold text-center mt-80">Loading, This would take a second...</p>

  return (
    <>
    <Navbar session={session}/>
    <div className='h-full w-full text-center my-16 text-6xl font-bold'>Coming soon...</div>
    </>
  )
}

export default page