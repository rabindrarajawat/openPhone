// components/Popup.tsx

"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import styles from './popup.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type PopupProps = {
  show: boolean;
  onHide: () => void;
  conversationId: string; 
};

const Popup = ({ show, onHide, conversationId }: PopupProps) => {
  const [addresses, setAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/address/getalladdress');
        console.log('API response:', response.data);

        if (Array.isArray(response.data)) {
          const addressesArray = response.data.map((item: any) => item.address);
          setAddresses(addressesArray);
          if (addressesArray.length > 0) {
            setSelectedAddress(addressesArray[0]);
          }
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  const handleSave = async () => {
    try {
      await axios.post('http://localhost:8000/conversation-mapping/map', {
        conversationId,
        address: selectedAddress,
      });
      setTimeout(() => toast.success('Saved successfully!'), 100); 
    
    } catch (error) {
      console.error('Error saving data:', error);
      setTimeout(() => toast.error('Failed to save data.'), 100); // Add delay
    }
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DropdownButton
            id="dropdown-basic-button"
            title={selectedAddress || 'Select Address'}
            className={styles.dropdown}
          >
            <div className={styles.dropdownMenu}>
              {addresses.map((address, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => setSelectedAddress(address)}
                >
                  {address}
                </Dropdown.Item>
              ))}
            </div>
          </DropdownButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer /> {/* Include ToastContainer here */}
    </>
  );
};

export default Popup;
