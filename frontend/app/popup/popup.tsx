"use client";
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
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
  const [filteredAddresses, setFilteredAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/address/getalladdress');
        console.log('API response:', response.data);

        if (Array.isArray(response.data)) {
          const addressesArray = response.data.map((item: any) => item.address);
          setAddresses(addressesArray);
          setFilteredAddresses(addressesArray);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    setFilteredAddresses(
      addresses.filter((address) =>
        address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, addresses]);

  const handleSave = async () => {
    console.log('Save button clicked'); // Debug line
    if (!selectedAddress) {
      toast.error('Please select an address before saving.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8000/conversation-mapping/map', {
        conversationId,
        address: selectedAddress,
      });
      toast.success('Saved successfully!');
      setTimeout(() => onHide(), 2000); // Delay hiding the modal to allow toast to show
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data.');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.dropdownContainer}>
            <button
              ref={dropdownToggleRef}
              className={`${styles.dropdownButton} ${styles.dropdownToggle}`}
              onClick={toggleDropdown}
            >
              {selectedAddress || 'Search Address'}
              <span className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`}>▼</span>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Form.Control
                  type="text"
                  placeholder="Search Address"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {filteredAddresses.length > 0 ? (
                  filteredAddresses.map((address, index) => (
                    <div
                      key={index}
                      className={styles.dropdownItem}
                      onClick={() => {
                        setSelectedAddress(address);
                        setSearchTerm('');
                        setIsDropdownOpen(false); // Close dropdown after selection
                      }}
                    >
                      {address}
                    </div>
                  ))
                ) : (
                  <div className={styles.dropdownItem} style={{ cursor: 'not-allowed' }}>
                    No addresses found
                  </div>
                )}
              </div>
            )}
          </div>
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