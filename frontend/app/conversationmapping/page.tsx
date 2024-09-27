'use client';
import React, { useState, useEffect,useCallback } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import Popup from '../popup/popup';
import styles from './page.module.css';
import SideBar from '../SideNavbar/sideNavbar';
import Navbar from '../Navbar/Navbar';
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';


interface DecodedToken {
  exp: number; // Expiration time in seconds since Unix epoch
}


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
  const recordsPerPage = 5; // Set records per page to 5
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const router = useRouter();



  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("authToken");
  
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch
  
        if (decoded.exp < currentTime) {
          // Token has expired
          localStorage.removeItem("authToken"); // Clear the expired token
          router.push("/"); // Redirect to login page
        }
      } catch (error) {
        console.error("Error decoding token", error);
        localStorage.removeItem("authToken"); // Clear the token and redirect
        router.push("/"); // Redirect to login page
      }
    } else {
      // No token found, redirect to login page
      router.push("/");
    }
  }, [router]); // Add 'router' as a dependency
  
  useEffect(() => {
    checkTokenExpiration(); // Check token expiration when component mounts
  }, [checkTokenExpiration]); // Memoized function in useCallback
  


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

        const data = response.data.data; // Adjusted to match your response structure
        console.log('Data:', data);

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
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios.get(`${Base_Url}openPhoneEventData/getConversationsWithoutAddress`, config)
      .then((response) => {
        const data = response.data.data; // Adjust to your actual response structure
        if (Array.isArray(data)) {
          setRecords(data);
        } else {
          console.error('API response is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }


  return (
    <div>
      <Navbar
      // toggleSidebar={toggleSidebar} onSelectAddress={handleAddressSelect1}
      />
      {isSidebarVisible && <SideBar />}
      <div className={`${styles.mainContainer} ${isSidebarVisible ? styles.sidebarVisible : ''}`}>
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
              onSaveSuccess={fetchData} // Pass the fetchData function to Popup
            />
          )}
        </Container>
      </div>
    </div>
  );
};

export default ConversationTable;
