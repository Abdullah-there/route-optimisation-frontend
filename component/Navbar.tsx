"use client";

import React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const Navbar = ({ session }: any) => {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
          
          {/* LOGO */}
          <Link href="/">
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-600">
              Route<span className="text-gray-800">AI</span>
            </h1>
          </Link>

          {/* NAV LINKS */}
          <ul className="flex items-center gap-8 text-gray-700 font-medium">
            <li className="hover:text-blue-600 transition">
              <Link href="/">Home</Link>
            </li>

            <li className="hover:text-blue-600 transition">
              <Link href="/playground">Playground</Link>
            </li>

            <li className="hover:text-blue-600 transition">
              <Link href="/map">Map</Link>
            </li>

            {!session && (
              <li>
                <Link
                  href="/auth/login"
                  className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
                >
                  Login
                </Link>
              </li>
            )}

            {session && (
              <li>
                <button
                  onClick={() => signOut()}
                  className="px-5 py-2 rounded-full border border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 transition"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]"></div>
    </>
  );
};

export default Navbar;
