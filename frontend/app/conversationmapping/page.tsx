"use client"
import React, { useState, useEffect } from 'react';
import { Table, Container, Dropdown } from 'react-bootstrap';
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
  const [records, setRecords] = useState<ConversationRecord[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);
  const [selectedAddress, setSelectedAddress] = useState('Search Address');
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState(30); // Default set to 20 records per page
  const [totalRecords, setTotalRecords] = useState(0); // Track the total records count for pagination
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  // Fetch data when page or page size changes
  const fetchData = async () => {
    const token = localStorage.getItem('authToken');
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
      } else {
        console.error('API response is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [Base_Url, currentPage, recordsPerPage]);

  const handleRowClick = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedRecord(null);
    fetchData(); // Re-fetch the data after the popup is closed
  };

  const handleAddressSelect1 = (address: Address) => {
    setSelectedAddress(address.fullAddress);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const handleRecordsPerPageChange = (newLimit: number) => {
    setRecordsPerPage(newLimit); // Change the records per page
    setCurrentPage(0); // Reset to first page
  };

  const pageCount = Math.ceil(totalRecords / recordsPerPage); // Calculate the page count based on total records and per-page records

  return (
    <div>
      <Navbar />

      <div className={`container-fluid ${styles.converstaionMapping}`}>
        <h2 className={styles.tableHeading}>Conversation Mapping</h2>

        <div className="d-flex justify-content-end mb-3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {recordsPerPage} records per page
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleRecordsPerPageChange(30)}>30</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRecordsPerPageChange(50)}>50</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRecordsPerPageChange(100)}>100</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

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
                records.map((record, index) => (
                  <tr key={index} onClick={() => handleRowClick(record)}>
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

        {selectedRecord && (
          <Popup
            show={showPopup}
            onHide={handlePopupClose}
            conversationId={selectedRecord.conversation_id} onSaveSuccess={function (): void {
              throw new Error('Function not implemented.');
            } }            // Pass any other necessary props here
          />
        )}

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
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationTable;

