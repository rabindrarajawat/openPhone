"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import './Navbar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SearchResultList } from "../SearchResultList/SearchResultList";
import "bootstrap-icons/font/bootstrap-icons.css";

interface Address {
  fullAddress: string;
}

interface SearchBarProps {
  setResults?: (results: Address[]) => void; // Optional prop
  onSelectAddress: (address: Address) => void; // Required prop
}

const Navbar: React.FC<SearchBarProps> = ({ setResults, onSelectAddress }) => {
  const [userName, setUserName] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [results, setResultsState] = useState<Address[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
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
      const response = await axios.get(`http://localhost:8000/address/search?address=${encodeURIComponent(value)}`);
      const results = response.data.results.filter((address: Address) =>
        address.fullAddress.toLowerCase().includes(value.toLowerCase())
      );
      setResultsState(results);
      if (setResults) {
        setResults(results);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  const handleSelectAddress = (address: Address) => {
    setInput(address.fullAddress);
    setResultsState([]);
    if (onSelectAddress) {
      onSelectAddress(address);
    }
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
            <Image src="/Icon.svg" alt="icon" className='search-icon' width={30} height={30} />
            <input
                className="search"
                type="search"
                placeholder="Search Address"
                aria-label="Search"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />
              {results.length > 0 && (
                <SearchResultList results={results} onSelect={handleSelectAddress} />
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
