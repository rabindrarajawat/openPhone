"use client";
import React, { useState, useEffect, useRef } from "react";
import { Table, Container, Dropdown, Button } from "react-bootstrap";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Popup from "../popup/popup";
import styles from "./page.module.css";
import Navbar from "../Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";

type ConversationRecord = {
  conversation_id: string;
  from: string;
  to: string;
  body: string;
  created_at: string;
};

interface Address {
  fullAddress: string;
}

const ConversationTable = () => {
  const isFetching = useRef(false); // Initialize isFetching with useRef

  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;
  const [records, setRecords] = useState<ConversationRecord[]>([]);
  const [allRecords, setAllRecords] = useState<ConversationRecord[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null); // Ref for table container

  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<ConversationRecord | null>(null);
  const [selectedAddress, setSelectedAddress] = useState("Search Address");
  const [currentPage, setCurrentPage] = useState(0);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(30); // Initialize to default
  const [totalRecords, setTotalRecords] = useState(0); // Track the total records count for pagination
  const [isLoading, setIsLoading] = useState(false);


  // Add a ref to track if the component is mounted
  const isMounted = useRef(false);
  useEffect(() => {
    const storedRecordsPerPage = localStorage.getItem("recordsPerPage");
    const parsedValue = storedRecordsPerPage
      ? parseInt(storedRecordsPerPage, 10)
      : 30; // Default to 30
    setRecordsPerPage(isNaN(parsedValue) ? 30 : parsedValue); // Set records per page from local storage or default
  }, []); // Run only once when the component mounts

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(
        `${Base_Url}openPhoneEventData/getConversationsWithoutAddress`,
        {
          params: {
            page: currentPage + 1, // API might be 1-indexed
            limit: recordsPerPage,
          },
          headers: config.headers,
        }
      );

      const data = response.data.data;
      setTotalRecords(response.data.totalCount); // Assuming your API returns total count
      if (Array.isArray(data)) {
        setRecords(data);
      } else {
        console.error("API response is not an array:", data);
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth", // Adds a smooth scrolling effect
      });

      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isFetching.current = false; // Reset fetch status
    }
  };

  useEffect(() => {
    if (!isFetching.current) {
      isFetching.current = true; // Mark as fetching
      fetchData();
    }
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
    localStorage.setItem("recordsPerPage", JSON.stringify(newLimit)); // Save newLimit to local storage
    setCurrentPage(0); // Reset to first page
  };

  const pageCount = Math.ceil(totalRecords / recordsPerPage); // Calculate the page count based on total records and per-page records

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    // Format the date in 'dd mm yyyy'
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    // Format the time in 'hh:mm AM/PM'
    const formattedTime = date.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true, // This enables 12-hour format with AM/PM
      timeZone: "UTC", // Ensures that time is shown in UTC
    });

    // Combine date and time
    return `${formattedDate} ${formattedTime}`;
  };

  const MapAddress = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.post(
        `${Base_Url}openPhoneEventData/mapUnmappedAddresses`,{},
        config
      );
      if(res.data.results.failed>0){
        toast.error("Failed to map addresses.");
      }
      else{

        const { totalProcessed, newAddressesCreated, conversationsMapped, failed } = res.data.results;
        toast.success(`Address mapping successful! 
          - Total Processed: ${totalProcessed}
          - New Addresses Created: ${newAddressesCreated}
          - Conversations Mapped: ${conversationsMapped}
          - Failed: ${failed}`);
        // toast.success(`Address mapping successful!  ,${JSON.stringify(res.data.results)}`);
        fetchData()
      }
    } catch (error:any) {
      console.log("🚀 ~ MapAddress ~ error:", error);
      toast.error(`"Failed to map addresses." ${error.response.data.message}`);
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className={`container-fluid ${styles.converstaionMapping}`}>
        <h2 className={styles.tableHeading}>Conversation Mapping</h2>

        <div className="d-flex justify-content-end mb-3">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {recordsPerPage} records per page
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleRecordsPerPageChange(30)}>
                30
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleRecordsPerPageChange(50)}>
                50
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleRecordsPerPageChange(100)}>
                100
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button className="ms-2 btn btn-success" onClick={MapAddress}>
            {isLoading ? "Processing" : "Auto Map Address"}
          </Button>
        </div>

        <div className={`table-responsive ${styles.tableContainer}`} ref={tableContainerRef}>
          <table
            className={`table table-bordered table-hover ${styles.customTable}`}
          >
            <thead>
              <tr>
                <th>Conversation ID</th>
                <th>From Number</th>
                <th>To Number</th>
                <th>Created At</th>
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
                    <td>{formatDate(record.created_at)}</td>
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
            conversationId={selectedRecord.conversation_id}
            onSaveSuccess={function (): void {
              throw (new Error("Function not implemented."), fetchData());
            }} // Pass any other necessary props here
          />
        )}

        <div className={styles.paginationContainer}>
          <ReactPaginate
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
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
