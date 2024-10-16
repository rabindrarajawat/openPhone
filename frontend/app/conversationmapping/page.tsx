"use client";
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Popup from '../popup/popup';
import styles from './page.module.css';
import Navbar from '../Navbar/Navbar';

type ConversationRecord = {
  conversation_id: string;
  from: string;
  to: string;
  body: string;
};

interface Address {
  fullAddress: string;
}

const ConversationTable = () => {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;

  // State Initialization
  const [recordsPerPage, setRecordsPerPage] = useState<number>(20); // Default to 20
  const [currentPage, setCurrentPage] = useState<number>(0); // Default to first page
  const [records, setRecords] = useState<ConversationRecord[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('Search Address');
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMounted, setIsMounted] = useState<boolean>(false); // To prevent hydration issues
  const [error, setError] = useState<string | null>(null); // For error handling

  // Effect to run on client-side after mount
  useEffect(() => {
    setIsMounted(true); // Mark as mounted to prevent SSR access

    if (typeof window !== 'undefined') {
      // Retrieve recordsPerPage from localStorage
      const savedRecordsPerPage = localStorage.getItem('recordsPerPage');
      if (savedRecordsPerPage) {
        const parsedRecordsPerPage = parseInt(savedRecordsPerPage, 10);
        if (!isNaN(parsedRecordsPerPage)) {
          setRecordsPerPage(parsedRecordsPerPage);
        }
      }

      // Retrieve currentPage from localStorage
      const savedCurrentPage = localStorage.getItem('currentPage');
      if (savedCurrentPage) {
        const parsedCurrentPage = parseInt(savedCurrentPage, 10);
        if (!isNaN(parsedCurrentPage)) {
          setCurrentPage(parsedCurrentPage);
        }
      }
    }
  }, []);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (isMounted) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Base_Url, currentPage, recordsPerPage, isMounted]);

  // Effect to save recordsPerPage to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('recordsPerPage', recordsPerPage.toString());
    }
  }, [recordsPerPage, isMounted]);

  // Effect to save currentPage to localStorage
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('currentPage', currentPage.toString());
    }
  }, [currentPage, isMounted]);

  // Function to handle row click
  const handleRowClick = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  // Function to fetch data from API
  const fetchData = async () => {
    if (typeof window === 'undefined') return; // Ensure client-side execution

    const token = localStorage.getItem('authToken');
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${Base_Url}openPhoneEventData/getConversationsWithoutAddress`, {
        params: {
          page: currentPage + 1, // API might be 1-indexed
          limit: recordsPerPage,
        },
        headers: config.headers,
      });

      const data = response.data.data;
      setTotalRecords(response.data.totalCount); // Assuming your API returns total count
      if (Array.isArray(data)) {
        setRecords(data);
        setError(null); // Clear any previous errors
      } else {
        console.error('API response is not an array:', data);
        setError('Invalid data format received from the server.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  // Function to handle popup close
  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedRecord(null);
    fetchData(); // Re-fetch data after popup closes
  };

  // Function to handle address selection (if applicable)
  const handleAddressSelect1 = (address: Address) => {
    setSelectedAddress(address.fullAddress);
  };

  // Function to handle page change via ReactPaginate
  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  // Function to handle recordsPerPage change via Dropdown
  const handleRecordsPerPageChange = (newLimit: number) => {
    setRecordsPerPage(newLimit); // Update recordsPerPage
    setCurrentPage(0); // Reset to first page
  };

  // Calculate total number of pages
  const pageCount = Math.ceil(totalRecords / recordsPerPage);

  // Prevent rendering until component is mounted to avoid hydration mismatch
  if (!isMounted) {
    return null; // You can return a loader here if desired
  }

  return (
    <div>
      <Navbar />

      <div className={`container-fluid ${styles.converstaionMapping}`}>
        <h2 className={styles.tableHeading}>Conversation Mapping</h2>

        {/* Display error message if any */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Dropdown for selecting records per page */}
        <div className="d-flex justify-content-end mb-3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {recordsPerPage} records per page
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item 
                active={recordsPerPage === 20}
                onClick={() => handleRecordsPerPageChange(20)}
              >
                20
              </Dropdown.Item>
              <Dropdown.Item 
                active={recordsPerPage === 30}
                onClick={() => handleRecordsPerPageChange(30)}
              >
                30
              </Dropdown.Item>
              <Dropdown.Item 
                active={recordsPerPage === 50}
                onClick={() => handleRecordsPerPageChange(50)}
              >
                50
              </Dropdown.Item>
              <Dropdown.Item 
                active={recordsPerPage === 100}
                onClick={() => handleRecordsPerPageChange(100)}
              >
                100
              </Dropdown.Item>
              {/* Add more options if needed */}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Table displaying conversations */}
        <div className={`table-responsive ${styles.tableContainer}`}>
          <table className={`table table-bordered table-hover ${styles.customTable}`}>
            <thead>
              <tr>
                <th>Conversation ID</th>
                <th>From Number</th>
                <th>To Number</th>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.conversation_id} onClick={() => handleRowClick(record)}>
                    <td>{record.conversation_id}</td>
                    <td>{record.from}</td>
                    <td>{record.to}</td>
                    <td>{record.body}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Popup for selected record */}
        {selectedRecord && (
          <Popup
            show={showPopup}
            onHide={handlePopupClose}
            conversationId={selectedRecord.conversation_id}
            onSaveSuccess={() => {
              // Implement your save success logic here
              // For example, you might want to refetch data or update the record in the state
            }}
          />
        )}

        {/* Pagination using ReactPaginate */}
        <div className={styles.paginationContainer}>
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            forcePage={currentPage} // Ensure the current page is highlighted correctly
            disableInitialCallback={true} // Prevent initial callback on mount
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationTable;
