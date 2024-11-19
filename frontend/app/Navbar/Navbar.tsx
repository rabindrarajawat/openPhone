import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import "./Navbar.css";
import NotificationItem from "../msgnotificationiItem";
import CallNotificationItem from "../callnotificationitem";
import Sidebar from "../SideNavbar/sideNavbar";

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

interface NotificationResponse {
  notifications: Notification[];
}

interface NotificationCountResponse {
  count: number;
}

const Navbar: React.FC = () => {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;
  const [userName, setUserName] = useState<string>("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("messages");
  const [page, setPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef<boolean>(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasInitialCountFetch = useRef<boolean>(false);


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const fullName = decodedToken.name;
        const firstName = fullName.split(" ")[0];
        setUserName(firstName);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

 

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    const fetchData = async () => {
      try {
        // Cancel any previous requests
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const token = localStorage.getItem("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal
        };

        // Fetch count only once
        if (!hasInitialCountFetch.current) {
          try {
            const countResponse = await axios.get<NotificationCountResponse>(
              `${Base_Url}notifications/count`,
              config
            );

            if (isMounted.current) {
              setNotificationCount(countResponse.data.count || 0);
              hasInitialCountFetch.current = true;
            }
          } catch (error) {
            if (!axios.isCancel(error) && isMounted.current) {
              console.error("Error fetching notification count:", error);
              setNotificationCount(0);
            }
            return;
          }
        }

        // Fetch unread notifications with pagination
        try {
          const response = await axios.get<NotificationResponse>(
            `${Base_Url}notifications/unread?page=${page}&limit=1000`,
            config
          );

          if (isMounted.current) {
            if (Array.isArray(response.data.notifications)) {
              setNotifications(prevNotifications => {
                // Filter out duplicates based on notification ID
                const existingIds = new Set(prevNotifications.map(n => n.id));
                const newNotifications = response.data.notifications.filter(
                  (                  notification: { is_read: any; id: number; }) => 
                    !notification.is_read && 
                    !existingIds.has(notification.id)
                );

                return [...prevNotifications, ...newNotifications];
              });
            } else {
              console.error("Unexpected response format:", response.data);
            }
          }
        } catch (error) {
          if (!axios.isCancel(error) && isMounted.current) {
            console.error("Error fetching notifications:", error);
          }
        }
      } catch (error) {
        if (!axios.isCancel(error) && isMounted.current) {
          console.error("Error in fetchData:", error);
        }
      }
    };

    // Debounce the fetch call
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [page]); // Only depend on page number



  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   };

  //   const fetchNotificationCount = async () => {
  //     try {
  //       const countResponse = await axios.get(
  //         `${Base_Url}notifications/count`,
  //         config
  //       );
  //       setNotificationCount(countResponse.data.count || 0);
  //     } catch (error) {
  //       console.error("Error fetching notification count:", error);
  //     }
  //   };

  //   const fetchNotifications = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${Base_Url}notifications/unread?page=${page}&limit=1000`,
  //         config
  //       );

  //       if (Array.isArray(response.data.notifications)) {
  //         setNotifications((prevNotifications) => [
  //           ...prevNotifications,
  //           ...response.data.notifications.filter(
  //             (notification: Notification) => !notification.is_read
  //           ),
  //         ]);
  //       } else {
  //         console.error("Unexpected response format:", response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching notifications:", error);
  //     }
  //   };

  //   fetchNotificationCount();
  //   fetchNotifications();
  // }, [Base_Url, page]);

  const handleScroll = () => {
    if (
      dropdownRef.current &&
      dropdownRef.current.scrollTop + dropdownRef.current.clientHeight >=
        dropdownRef.current.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1); // Load next page
    }
  };

  const handleBellClick = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      dropdownRef.current?.addEventListener("scroll", handleScroll);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      dropdownRef.current?.removeEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      dropdownRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [showDropdown]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const handleMarkAsRead = async (event_id: number) => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.post(
        `${Base_Url}notifications/${event_id}/read`,
        {},
        config
      );

      if (response.status === 200 || response.status === 201) {
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.event_id !== event_id
          )
        );
        setNotificationCount((prevCount) => prevCount - 1);
      } else {
        console.error("Failed to mark notification as read:", response);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "calls") {
      return (
        notification.event.event_type_id === 3 ||
        notification.event.event_type_id === 4
      );
    } else if (activeTab === "messages") {
      return (
        notification.event.event_type_id === 1 ||
        notification.event.event_type_id === 2
      );
    }
    return false;
  });

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count;
  };

  return (
    <>
      <Sidebar />
      <nav className="navbar">
        <div className="container-fluid">
          <div className="logo-openphone">
            <Image
              src="/line.svg"
              alt="Logo"
              className="logo1"
              width={50}
              height={50}
            />
            <div className="openphone">
              <span className="border-bottom pb-3 ms-5 fs-4">OpenPhone</span>
            </div>
          </div>
          <div className="nav-list">
            <div className="profileicon">
              <Image
                src="/account_circle.svg"
                alt="Profile"
                className="profile"
                width={50}
                height={50}
              />
            </div>
            <a className="name">{userName || "User"}</a>
            <div className="bellicon" onClick={handleBellClick}>
              <Image
                src="/bell.svg"
                alt="Notifications"
                className="bell"
                width={50}
                height={50}
              />
              {notificationCount > 0 && (
                <span className="new-notification-dot">
                  {formatCount(notificationCount)}
                </span>
              )}
            </div>
            {showDropdown && (
              <div className="notification-dropdown" ref={dropdownRef}>
                <div className="main-notification">
                  <span
                    className={activeTab === "calls" ? "text-danger" : ""}
                    onClick={() => setActiveTab("calls")}
                  >
                    <i className="bi bi-telephone-inbound-fill call-icon"></i>{" "}
                    Calls
                  </span>
                  <span
                    className={activeTab === "messages" ? "text-danger" : ""}
                    onClick={() => setActiveTab("messages")}
                  >
                    <i className="bi bi-chat-right-text message-icon"></i>{" "}
                    Messages
                  </span>
                </div>
                <div className="border-bottom mt-2"></div>
                <ul>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) =>
                      activeTab === "calls" ? (
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
                          handleMarkAsRead={handleMarkAsRead}
                          id={0}
                          address_id={null}
                          created_at={""}
                        />
                      )
                    )
                  ) : (
                    <li>No notifications available</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
