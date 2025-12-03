"use client"

import Navbar from './Navbar'
import { motion } from "framer-motion";
import { p } from 'framer-motion/client';
import { useSession } from 'next-auth/react';

const Home = () => {
  const { data: session, status} = useSession();
  
    if (status == "loading") return <p>Loading ...</p>

  return (
    <>
      <Navbar session={session}/>

      <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-200 px-4 text-center">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight mt-10"
        >
          AI-Powered{" "}
          <span className="text-blue-500">
            Route Optimisation
          </span>
          <br />
          with Real-Time Traffic Simulation
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-gray-600 text-lg md:text-xl max-w-2xl"
        >
          Build, simulate, and optimise travel routes using advanced AI,
          interactive maps, and live traffic estimation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl w-full px-4"
        >
          
          <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-2xl transition cursor-pointer border">
            <h3 className="text-xl font-semibold text-gray-800">
              ⚙️ Powerful Backend
            </h3>
            <p className="text-gray-600 mt-2">
              Built with <span className="font-bold">Java & Spring Boot</span>,
              delivering fast API performance and an efficient route engine.
            </p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-2xl transition cursor-pointer border">
            <h3 className="text-xl font-semibold text-gray-800">
              🖥️ Modern Frontend
            </h3>
            <p className="text-gray-600 mt-2">
              Built using <span className="font-bold">React + Next.js</span> with
              a dynamic playground and drag-and-drop route editor.
            </p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-2xl hover:shadow-2xl transition cursor-pointer border">
            <h3 className="text-xl font-semibold text-gray-800">
              🗄️ Robust Database
            </h3>
            <p className="text-gray-600 mt-2">
              Uses <span className="font-bold">PostgreSQL + Spring JPA</span> to
              store nodes, routes, and user data securely.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12 max-w-3xl text-gray-700 px-4 mb-20"
        >
          <h2 className="text-2xl font-bold">✨ Additional Features</h2>
          <ul className="mt-3 space-y-2 text-lg">
            <li>• Interactive node placement & route creation</li>
            <li>• Traffic-based path optimization algorithms</li>
            <li>• Save/load custom playground maps</li>
            <li>• Fully responsive & modern UI</li>
            <li>• Real-time simulation behavior</li>
          </ul>
        </motion.div>
      </div>
    </>
  )
}

export default Home;
