import React, { useEffect, useState,useMemo } from 'react';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './Navbar.css';
import 'react-toastify/dist/ReactToastify.css';
import NotificationItem from '../notificationiItem';

interface Address {
  fullAddress: string;
}

interface Notification {
  id: number;
  address_id: number | null;
  event_id: number;
  is_read: boolean;
  created_at: string;
  event: {
    id: number;
    event_type_id: number;
    address_id: number | null;
    event_direction_id: number;
    from: string;
    to: string;
    body: string;
    url: string;
    url_type: string;
    conversation_id: string;
    created_by: string;
    contact_established: string;
    dead: string;
    created_at: string;
    received_at: string;
    keep_an_eye: string;
    is_stop: boolean;
    phone_number_id: string;
    user_id: string;
  };
}

interface NavbarProps extends SearchBarProps {
  toggleSidebar: () => void;
}

interface SearchBarProps {
  setResults?: (results: Address[]) => void;
  onSelectAddress: (address: Address) => void;
}


const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;

  const [showDropdown, setShowDropdown] = useState<boolean>(false);




  const [userName, setUserName] = useState<string>('');

  const token = localStorage.getItem("authToken");


  const config = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }), [token]);


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setUserName(decodedToken.name);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${Base_Url}notifications`, config);
        setNotifications(response.data.filter((notification: Notification) => !notification.is_read));
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [Base_Url,config]);








  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (event_id: number) => {
    try {
      const response = await axios.post(`${Base_Url}notifications/${event_id}/read`, null, config);
      console.log("Backend Response:", response);

      if (response.status === 200 || response.status === 201) {
        setNotifications(prevNotifications =>
          prevNotifications.filter(notification => notification.event_id !== event_id)
        );
      } else {
        console.error("Failed to mark notification as read:", response);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const newNotificationCount = notifications.length;

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <Image
          src="/line.svg"
          alt="Logo"
          className="logo1"
          width={50}
          height={50}
          onClick={toggleSidebar}
        />
        <div className='nav-list'>
          <div className='profileicon'>
            <Image src="/account_circle.svg" alt="Profile" className='profile' width={50} height={50} />
          </div>

          <a className='name'>
            {userName || 'User'}
          </a>

          <div className='bellicon' onClick={handleBellClick}>
            <Image src="/bell.svg" alt="Notifications" className='bell' width={50} height={50} />
            {newNotificationCount > 0 && (
              <span className="new-notification-dot">{newNotificationCount}</span>
            )}
          </div>

          {showDropdown && (
            <div className="notification-dropdown">
              <div className='main-notification'>
                <span><i className="bi bi-telephone-inbound-fill call-icon"></i> Calls</span>
                <span className='text-danger'> <i className="bi bi-chat-right-text icon-message"></i> Message </span>
              </div>
              <div className='border-bottom mt-2'></div>

              <ul>
                {notifications.map(notification => (
                  <NotificationItem
                    key={notification.event_id}
                    event={notification.event}
                    is_read={notification.is_read}
                    event_id={notification.event_id}
                    handleMarkAsRead={handleMarkAsRead} id={0} address_id={null} created_at={''} />
                ))}
              </ul>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
