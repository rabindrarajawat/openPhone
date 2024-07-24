


import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import './Navbar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchResultList } from "../SearchResultList/SearchResultList";

const Navbar = () => {
  const [userName, setUserName] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [results, setResultsState] = useState<Array<{ fullAddress: string }>>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (token) {
      try {
        // Decode the token
        const decodedToken: any = jwtDecode(token);
        setUserName(decodedToken.name);
        console.log("decodedToken", decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const fetchData = async (value: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/address/search?term=${encodeURIComponent(value)}`);
      const results = response.data.results.filter((address: { fullAddress: string }) => {
        return (
          address.fullAddress &&
          address.fullAddress.toLowerCase().includes(value.toLowerCase())
        );
      });
      setResultsState(results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Image src="/line.svg" alt="Logo" className='logo1' width={50} height={50} />
        <div className="navbar-brand1">
          OpenPhone <br />
          <p className="dashboard">Dashboard</p>
        </div>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
            <div className="search-wrapper">
              <input
                className="search"
                type="search"
                placeholder="Search Address"
                aria-label="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />
              {results.length > 0 && (
                <SearchResultList results={results} />
              )}
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
