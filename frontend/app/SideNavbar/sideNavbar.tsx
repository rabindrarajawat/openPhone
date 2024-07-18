"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import './SideNavbar.css'
import { useRouter } from "next/navigation";
const SideBar = () => {
    const router = useRouter();

    return (
        <>
            <ul className='sidebar'>
                <div>
                    <li className="nav">
                        <Image src="/upicon.svg" alt="Logo" className='logo2' width={50} height={50} />
                        <label className='dash' htmlFor="">Dashboard</label>

                    </li>
                </div>
                {/* <li className="nav">
                <Image src="/star.svg" alt="Logo" className='logo2' width={50} height={50} />

            </li>
            <li className="nav">
                <Image src="/message.svg" alt="Logo" className='logo2' width={50} height={50} />

            </li>
            <li className="nav">
                <Image src="/up1.svg" alt="Logo" className='logo2' width={50} height={50} />
            </li> */}

                <li className="log">
                    <div onClick={() => router.push("/")}
                    >log out</div>
                </li>
            </ul>

        </>

    );
};

export default SideBar;
