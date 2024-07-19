import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { jwtDecode } from "jwt-decode";
import './Navbar.css';

const Navbar = () => {
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Decode the token
        const decodedToken: any = jwtDecode(token);
        setUserName(decodedToken.name);
        console.log("decodedToken", decodedToken)
        // Assuming `email` is part of the token payload
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Image src="/line.svg" alt="Logo" className='logo1' width={50} height={50} />

        <div className="navbar-brand1" >OpenPhone <br />
          <p className="dashboard" > Dashboard  </p>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" role="search">
            <div className="search-wrapper">
              <input className="search" type="search" placeholder="Search Address" aria-label="Search" />
            </div>
          </form>
        </div>

        <div className='profileicon'>
          <Image src="/account_circle.svg" alt="Profile" className='profile' width={50} height={50} />
        </div>

        <a className='name'>
          {userName || 'User'}
        </a>

        <div className='bellicon'>
          <Image src="/bell.svg" alt="Notifications" className='bell' width={50} height={50} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
