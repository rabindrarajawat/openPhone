"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './SideNavbar.css';

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
                <li className="log">
                    <div onClick={handleLogout}>Log out</div>
                </li>
            </ul>
        </>
    );
};

export default SideBar;
