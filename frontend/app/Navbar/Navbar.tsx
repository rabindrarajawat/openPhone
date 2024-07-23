import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './Navbar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
  const [userName, setUserName] = useState<string>('');
  const [address, setAddress] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Decode the token
        const decodedToken: any = jwtDecode(token);
        setUserName(decodedToken.name);
        console.log("decodedToken", decodedToken)
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handleAddress = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!address.trim()) {
      toast.error('Please enter a valid address.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/address/getalladdress`);
      console.log(response.data);
      toast.success('Address found successfully!');
    } catch (error: any) { 
      if (error.response && error.response.status === 404) {
        toast.error('Address are incorrect please type correct address.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
      console.error('Error fetching address details:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Image src="/line.svg" alt="Logo" className='logo1' width={50} height={50} />

        <div className="navbar-brand1" >OpenPhone <br />
          <p className="dashboard" > Dashboard  </p>
        </div>
<div>
  
</div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <form className="d-flex" role="search" onSubmit={handleAddress}>
        <div className="search-wrapper">
          <input
            className="search"
            type="search"
            placeholder="Search Address"
            aria-label="Search"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <ToastContainer />


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
