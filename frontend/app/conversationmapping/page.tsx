<<<<<<< HEAD
'use client';
import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
=======
// src/components/ConversationTable.jsx
'use client'
import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
>>>>>>> 676043e8ba8f2fbac2ae748721c45b48ea185455
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Popup from '../popup/popup';
import styles from './page.module.css';
import SideBar from '../SideNavbar/sideNavbar';
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
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
<<<<<<< HEAD

  useEffect(() => {
   
  const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log('Token being used:', token);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Base_Url}openPhoneEventData/getConversationsWithoutAddress`, config);
      console.log('API response:', response);
=======
  const recordsPerPage = 5;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
>>>>>>> 676043e8ba8f2fbac2ae748721c45b48ea185455

      if (!token) {
        console.error("No auth token found. Please log in.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${Base_Url}openPhoneEventData/getConversationsWithoutAddress`, config);
      const data = response.data.data;

      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        console.error('API response is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
}, [Base_Url]); // Dependency on config to re-fetch if token changes


  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedRecord(null);
  };

  const handleAddressSelect1 = (address: Address) => {
    setSelectedAddress(address.fullAddress);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  const offset = currentPage * recordsPerPage;
  const currentPageData = records.slice(offset, offset + recordsPerPage);
  const pageCount = Math.ceil(records.length / recordsPerPage);

  const toggleSidebar = () => {
    setIsSidebarVisible(prevState => !prevState);
  };

  function fetchData(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div>
      <Navbar toggleSidebar={toggleSidebar} onSelectAddress={handleAddressSelect1} />
      {isSidebarVisible && <SideBar />}
<<<<<<< HEAD
      <div className={`${styles.mainContainer} ${isSidebarVisible ? styles.sidebarVisible : ''}`}>
=======
      <div className={`${styles.mainContainer} ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
>>>>>>> 676043e8ba8f2fbac2ae748721c45b48ea185455
        <Container className={styles.container}>
          <h2 className={styles.tableHeading}>Conversation Mapping</h2>
          <Table bordered hover className={styles.conversationTable}>
            <thead>
              <tr>
                <th>Conversation ID</th>
                <th>From Number</th>
                <th>To Number</th>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.length > 0 ? (
                currentPageData.map((record, index) => (
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
          </Table>
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
          {selectedRecord && (
            <Popup
              show={showPopup}
              onHide={handlePopupClose}
              conversationId={selectedRecord.conversation_id}
              onSaveSuccess={fetchData}
            />
          )}
        </Container>
      </div>
    </div>
  );
};

export default ConversationTable;
