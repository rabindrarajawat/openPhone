// src/components/ConversationTable.jsx
'use client'
import React, { useState, useEffect } from "react";
import { Table, Container } from "react-bootstrap";
import axios from 'axios';
import Popup from '../popup/popup'; // Adjust the path as needed
import styles from './page.module.css'; // Ensure this path is correct

type ConversationRecord = {
  conversation_id: string;
  from: string;
  to: string;
  body: string;
};

const ConversationTable = () => {
  const [records, setRecords] = useState<ConversationRecord[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ConversationRecord | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/openPhoneEventData/getConversationsWithoutAddress');
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
  }, []);

  const handleRowClick = (record: ConversationRecord) => {
    setSelectedRecord(record);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setSelectedRecord(null);
  };

  return (
    <div className={styles.mainContainer}>
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
        </Table>
        {selectedRecord && (
          <Popup
            show={showPopup}
            onHide={handlePopupClose}
            conversationId={selectedRecord.conversation_id}
          />
        )}
      </Container>
    </div>
  );
};

export default ConversationTable;
