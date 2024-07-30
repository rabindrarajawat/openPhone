"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useRouter } from 'next/navigation';
import './SideNavbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const SideBar = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Remove the token from local storage
        localStorage.removeItem('authToken');
        
        // Redirect to the home page
        router.push('/');
    };

    return (
        <>
            <ul className='sidebar'>
                <div>
                    <li className="nav">
                        <Image src="/upicon.svg" alt="Logo" className='logo2' width={50} height={50} />
                        <label className='dash' htmlFor="">Dashboard</label>
                    </li>
                </div>
                <div>
      <li className="nav">
        <Link href="/conversationmapping">
          <p className='dash'>conversation mapping</p>
        </Link>
      </li>
    </div>

                <p className="log">
                    <div onClick={handleLogout}>Log out</div>
                </p>
            </ul>
        </>
    );
};

export default SideBar;
