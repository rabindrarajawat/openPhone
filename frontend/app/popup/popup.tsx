// components/Popup.tsx
import { useState } from 'react';
import { Modal, Form, Dropdown, DropdownButton, Button } from 'react-bootstrap';
import styles from './popup.module.css';

type PopupProps = {
  show: boolean;
  onHide: () => void;
};

const dummyAddresses = [
  'Address 1',
  'Address 2',
  'Address 3',
  'Address 4'
];

const Popup = ({ show, onHide }: PopupProps) => {
  const [search, setSearch] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const filteredAddresses = dummyAddresses.filter(address =>
    address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search address"
            value={search}
            onChange={handleSearchChange}
          />
        </Form.Group>
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedAddress || 'Select Address'}
          className={styles.dropdown}
        >
          {filteredAddresses.map((address, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => setSelectedAddress(address)}
            >
              {address}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Popup;
