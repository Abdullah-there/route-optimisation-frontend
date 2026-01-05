"use client";

import Navbar from "./Navbar";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading")
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  return (
    <>
      <Navbar session={session} />

      <section className="relative min-h-[92vh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden px-6">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900"
          >
            AI-Powered{" "}
            <span className="text-blue-600">
              Route Optimisation
            </span>
            <br />
            with Real-Time Traffic Simulation
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-gray-600 text-lg md:text-xl max-w-3xl mx-auto"
          >
            Design, simulate, and optimise intelligent travel routes using
            advanced algorithms, interactive maps, and realistic traffic
            behavior.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:bg-blue-700 transition">
              <Link href={"/playground"}>Get Started</Link>
            </button>
            <button className="px-8 py-3 rounded-full border border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 transition">
              <Link href={"/map"}>See Map</Link>
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: "Powerful Backend",
                desc: "Built with Java & Spring Boot for fast, scalable APIs and efficient route computation.",
              },
              {
                title: "Modern Frontend",
                desc: "Next.js + React interface with smooth animations and an interactive map playground.",
              },
              {
                title: "Reliable Database",
                desc: "PostgreSQL with Spring JPA ensures secure and consistent storage of routes and users.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-lg bg-blue-50/60 border border-blue-100 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600 mt-3">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-gray-900"
          >
            ✨ Additional Capabilities
          </motion.h2>

          <ul className="mt-8 space-y-3 text-lg text-gray-700">
            <li>• Interactive node placement & route creation</li>
            <li>• Traffic-based shortest path optimisation</li>
            <li>• Save & load custom simulation maps</li>
            <li>• Fully responsive modern UI</li>
            <li>• Real-time traffic simulation behavior</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-600 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-bold">
              AI Route Optimisation System
            </h3>
            <p className="text-blue-100 mt-1 text-sm">
              Smart routing with real-time traffic simulation
            </p>
          </div>

          <div className="text-sm text-blue-100">
            © {new Date().getFullYear()} All Rights Reserved
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
