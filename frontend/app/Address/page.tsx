"use client"; // Ensure this is a client-side component

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from '../Pagination/pagination';

// Define the address type with all relevant fields
interface Address {
  id: number;
  address: string; // Change fullAddress to address based on your API response
}

const AddressList = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Adjust as needed
  const [totalItems, setTotalItems] = useState(0);
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;

  const token = typeof window !== 'undefined' ? localStorage.getItem("authToken") : null;

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${Base_Url}address/getalladdress`, {
          ...config,
          params: {
            page: currentPage,
            limit: itemsPerPage,
          },
        });

        // Log the API response to understand its structure
 
        // Ensure addresses are set correctly
        if (response.data && response.data.data) {
          setAddresses(response.data.data); // Adjusted to reflect the correct field name
          setTotalItems(response.data.totalCount); // Total items for pagination
        } else {
          setAddresses([]); // Set to empty if no data found
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setAddresses([]); // Handle error case by clearing addresses
      }
    };

    fetchAddresses();
  }, [currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page on changing items per page
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="itemsPerPage" style={{ marginRight: '10px' }}>Show per page:</label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <ul>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <li key={address.id}>{address.address}</li> // Use address instead of fullAddress
          ))
        ) : (
          <p>No addresses found.</p>
        )}
      </ul>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AddressList;
