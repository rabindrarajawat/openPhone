import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import './Navbar.css';
import NotificationItem from '../msgnotificationiItem';
import CallNotificationItem from '../callnotificationitem';

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

const Navbar: React.FC = () => {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;
  const [userName, setUserName] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState('messages');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

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
  }, [Base_Url]);

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleMarkAsRead = async (event_id: number) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No authentication token found');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(`${Base_Url}notifications/${event_id}/read`, {}, config);

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

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'calls') {
      return notification.event.event_type_id === 3 || notification.event.event_type_id === 4;
    } else if (activeTab === 'messages') {
      return notification.event.event_type_id === 1 || notification.event.event_type_id === 2;
    }
    return false;
  });

  const newNotificationCount = notifications.length;

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M'; // Convert to millions
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K'; // Convert to thousands
    }
    return count; // Return the original count if it's less than 1000
  };


  return (
    <nav className="navbar">
      <div className="container-fluid">
        <Image
          src="/line.svg"
          alt="Logo"
          className="logo1"
          width={50}
          height={50}
          onClick={() => { }}
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
              <span className="new-notification-dot">{formatCount(newNotificationCount)}</span>
            )}
          </div>

          {showDropdown && (
            <div className="notification-dropdown" ref={dropdownRef}>
              <div className="main-notification">
                <span
                  className={activeTab === 'calls' ? 'text-danger' : ''}
                  onClick={() => setActiveTab('calls')}
                >
                  <i className="bi bi-telephone-inbound-fill call-icon"></i> Calls
                </span>
                <span
                  className={activeTab === 'messages' ? 'text-danger' : ''}
                  onClick={() => setActiveTab('messages')}
                >
                  <i className="bi bi-chat-right-text message-icon"></i> Messages
                </span>
              </div>
              <div className="border-bottom mt-2"></div>

              <ul>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map(notification => (
                    activeTab === 'calls' ? (
                      <CallNotificationItem
                        key={notification.event_id}
                        event={notification.event}
                        is_read={notification.is_read}
                        event_id={notification.event_id}
                        handleMarkAsRead={handleMarkAsRead}
                      />
                    ) : (
                      <NotificationItem
                        key={notification.event_id}
                        event={notification.event}
                        is_read={notification.is_read}
                        event_id={notification.event_id}
                        handleMarkAsRead={handleMarkAsRead} id={0} address_id={null} created_at={''} />
                    )
                  ))
                ) : (
                  <li>No notifications available</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
