// pages/conversation-mapping.tsx
"use client";
import { useState, useEffect } from "react";
import { Container, Table, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import Popup from '../popup/popup'; // Adjust the path as needed
import styles from './page.module.css';

type ConversationRecord = {
  conversation_id: string;
  from: string;
  to: string;
  body: string;
};

const ConversationMapping = () => {
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

  const handleSave = () => {
    console.log('Save clicked');
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  return (
    <div className={styles.mainContainer}>
      <Container className={styles.container}>
        <h1>Conversation Mapping</h1>
        <Form>
          <Table striped bordered hover className={styles.table}>
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
                    <td>
                      <Form.Control
                        type="text"
                        value={record.conversation_id}
                        readOnly
                        className={styles['form-control-custom']} // Apply custom class
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={record.from}
                        readOnly
                        className={styles['form-control-custom']} // Apply custom class
                      />
                    </td>
                    <td>
                      <Form.Control
                        type="text"
                        value={record.to}
                        readOnly
                        className={styles['form-control-custom']} // Apply custom class
                      />
                    </td>
                    <td>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={record.body}
                        readOnly
                        className={styles['form-control-custom']} // Apply custom class
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>No records found</td>
                </tr>
              )}
            </tbody>
          </Table>
          <div className={styles.buttons}>
            <Button variant="primary" onClick={handleSave} className={styles.button}>
              Save
            </Button>
            <Button variant="secondary" onClick={handleCancel} className={styles.button}>
              Cancel
            </Button>
          </div>
        </Form>
        {selectedRecord && (
          <Popup show={showPopup} onHide={handlePopupClose} />
        )}
      </Container>
    </div>
  );
};

export default ConversationMapping;
