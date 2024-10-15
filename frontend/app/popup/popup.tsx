'use client';
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
  onSaveSuccess: () => void;
};

const Popup = ({ show, onHide, conversationId, onSaveSuccess }: PopupProps) => {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;
  const [addresses, setAddresses] = useState<string[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<string[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Default to 20
  const [totalItems, setTotalItems] = useState(0);

  const dropdownToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
          const response = await axios.get(`${Base_Url}address/getalladdress`, {
            ...config,
            params: {
              page: currentPage,
              limit: itemsPerPage,
            },
          });

        if (Array.isArray(response.data.data)) {
          const addressesArray = response.data.data.map((item: any) => item.address);
          setAddresses(addressesArray);
          setFilteredAddresses(addressesArray);
          setTotalItems(response.data.totalCount);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, [Base_Url, currentPage, itemsPerPage]);

  useEffect(() => {
    setFilteredAddresses(
      addresses.filter((address) =>
        address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, addresses]);

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (!selectedAddress) {
      toast.error('Please select an address before saving.');
      return;
    }

    try {
      await axios.post(
        `${Base_Url}conversation-mapping/map`,
        { conversationId, address: selectedAddress },
        config
      );
      toast.success('Saved successfully!');
      setTimeout(() => {
        onHide();
        onSaveSuccess();
      }, 2000); 
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data.');
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page whenever items per page changes
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
              <span
                className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.open : ''}`}
              >
                ▼
              </span>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <input
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
                        setIsDropdownOpen(false);
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

          {/* Pagination and Items per Page Dropdown */}
          <div className={styles.paginationContainer}>
            <div className={styles.itemsPerPageDropdown}>
              <label htmlFor="itemsPerPage" className="mr-2">Address per page:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="form-control"
              >
                <option value={20}>20</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <Button
            className='mt-3'
              variant="link"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Prev
            </Button>
            <span className='mt-4'>{`${currentPage} / ${totalPages}`}</span>
            <Button
            className='mt-3'
              variant="link"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
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
      <ToastContainer />
    </>
  );
};

export default Popup;
