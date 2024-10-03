"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Navbar from "../Navbar/Navbar";
import SideBar from "../SideNavbar/sideNavbar";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SearchResultList } from "../SearchResultList/SearchResultList";
import { config } from "process";
import Pagination from "../Pagination/pagination";
import { jwtDecode } from "jwt-decode";
import styles from "./dashboard.module.css";

interface DecodedToken {
  exp: number; // Expiration time in seconds since Unix epoch
}

interface Address {
  fullAddress: string;
}

interface Address1 {
  fullAddress: string;
  id: number;
  displayAddress: string;
  is_bookmarked: boolean;
  auction_event_id: number;
  created_at: string;
  notificationCount: number; // Add this field
  address: string;
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

interface EventItem {
  created_at: string;
  modified_at: string | null;
  created_by: string;
  modified_by: string | null;
  is_active: boolean;
  id: number;
  event_type_id: number;
  address_id: number;
  event_direction_id: number;
  from: string;
  to: string;
  url: string;
  url_type: string;
  conversation_id: number;
  received_at: string;
  contact_established: string;
  dead: string;
  keep_an_eye: string;
  is_stop: string;
  body: string;
  is_message_pinned: boolean;
}

const Dashboard = () => {
  const Base_Url = process.env.NEXT_PUBLIC_BASE_URL;



  const [selectedAddress, setSelectedAddress] = useState("Search Address");
  const [eventData, setEventData] = useState<EventItem[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [fromNumber, setFromNumber] = useState("");

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [messageDelivered, setMessageDelivered] = useState<number>(0);
  const [messageResponse, setMessageResponse] = useState<number>(0);
  const [call, setCall] = useState<number>(0);
  const [callResponse, setCallResponse] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [results, setResultsState] = useState<Address[]>([]);
  const [addresses1, setAddresses1] = useState<Address1[]>([]);

  const [isType, setIsType] = useState(false);

  const [isCustomDateOpen, setIsCustomDateOpen] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [uniqueFromNumbers, setUniqueFromNumbers] = useState<string[]>([]);

  const [expandedMessages, setExpandedMessages] = useState(new Map());

  const [counts, setCounts] = useState({
    messageDelivered: 0,
    messageResponse: 0,
    call: 0,
    callResponse: 0,
  });

  const [loading, setLoading] = useState(true);
  const [selectedAuctionTypes, setSelectedAuctionTypes] = useState<number[]>(
    []
  );
  const [filterOption, setFilterOption] = useState<
    "all" | "bookmarked" | "default"
  >("default");
  const [timeFilter, setTimeFilter] = useState<"all" | "weekly" | "monthly">(
    "all"
  );
  const [showAllAddresses, setShowAllAddresses] = useState<boolean>(true);
  const [selectedDateFilter, setSelectedDateFilter] = useState<
    "all" | "weekly" | "monthly"
  >("all");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(
    new Set<string>()
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [deliveredChecked, setDeliveredChecked] = useState(false);
  const [receivedChecked, setReceivedChecked] = useState(false);
  const [addresses2, setAddresses2] = useState<Address1[]>([]);
  const [filteredAddresses2, setFilteredAddresses2] = useState<Address1[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTo, setSearchTo] = useState(""); // State to hold search input
  const addressesPerPage = 10;

  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();


  const groupedMessages = events.reduce<{ [key: string]: EventItem[] }>(
    (acc, message) => {
      if (!acc[message.conversation_id]) {
        acc[message.conversation_id] = [];
      }
      acc[message.conversation_id].push(message);
      return acc;
    },
    {}
  );

  const [updatedMessages, setUpdatedMessages] = useState(groupedMessages);
  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds since Unix epoch

        if (decoded.exp < currentTime) {
          // Token has expired
          localStorage.removeItem("authToken"); // Clear the expired token
          router.push("/"); // Redirect to login page
        }
      } catch (error) {
        console.error("Error decoding token", error);
        localStorage.removeItem("authToken"); // Clear the token and redirect
        router.push("/"); // Redirect to login page
      }
    } else {
      // No token found, redirect to login page
      router.push("/");
    }
  }, [router]); // Ensure that 'router' is included in dependencies


  useEffect(() => {
    checkTokenExpiration(); // Check token expiration when the component mounts
  }, [checkTokenExpiration]);

  useEffect(() => {
    const storedPins = localStorage.getItem("pinnedConversations");
    if (storedPins) {
      setPinnedConversations(new Set<string>(JSON.parse(storedPins)));
    }
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/";
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      // Retrieve Token
      const token = localStorage.getItem("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Token being used:", token);

      try {
        // Fetch all addresses with the token in the headers
        console.log("Config before getalladdress:", config);
        const addressResponse = await axios.get(
          `${Base_Url}address/getalladdress`,
          config
        );

        const formattedAddresses = addressResponse.data.map((item: any) => ({
          id: item.id,
          displayAddress: item.address,
          is_bookmarked: item.is_bookmarked,
          auction_event_id: item.auction_event_id,
          created_at: item.created_at,
          notificationCount: 0,
          address: item.address,
        }));

        setAddresses2(formattedAddresses);
        setFilteredAddresses2(formattedAddresses);

        // Fetch unread notifications with the token in the headers
        const notificationResponse = await axios.get(
          `${Base_Url}notifications`,
          config
        );

        const unreadNotifications = notificationResponse.data.filter(
          (notification: any) => !notification.is_read
        );
        setNotifications(unreadNotifications);

        // Calculate notification counts
        const addressNotificationCounts = formattedAddresses.map(
          (address: any) => {
            const count = unreadNotifications.filter(
              (notification: any) => notification.address_id === address.id
            ).length;
            return { ...address, notificationCount: count };
          }
        );

        setAddresses1(addressNotificationCounts);

        // Sort addresses by created_at to get the latest one
        const sortedAddresses = addressNotificationCounts.sort(
          (
            a: { created_at: string | number | Date },
            b: { created_at: string | number | Date }
          ) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        // Set default selected address as the latest created address
        if (sortedAddresses.length > 0) {
          setSelectedAddress(sortedAddresses[0].displayAddress);
          setSelectedAddressId(sortedAddresses[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [Base_Url]);

  useEffect(() => {
    // Retrieve Token
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Token being used:", token);

    const fetchFilteredAddresses = async () => {
      let deliveredAddresses = [];
      let receivedAddresses = [];

      if (deliveredChecked) {
        // Fetch delivered addresses
        const deliveredResponse = await axios.get(
          `${Base_Url}openPhoneEventData?filter=delivered`,
          config
        );
        deliveredAddresses = deliveredResponse.data.data
          .filter(
            (event: { event_type_id: number }) => event.event_type_id === 2
          )
          .map((event: { address: any }) => event.address);
      }

      if (receivedChecked) {
        // Fetch received addresses
        const receivedResponse = await axios.get(
          `${Base_Url}openPhoneEventData?filter=received`,
          config
        );
        receivedAddresses = receivedResponse.data.data.map(
          (event: { address: any }) => event.address
        );
      }

      // Combine both delivered and received addresses
      const combinedAddresses = [
        ...new Set([...deliveredAddresses, ...receivedAddresses]),
      ];

      // Filter the addresses based on the combined addresses
      const filtered = addresses2.filter((addressObj: { address: any }) =>
        combinedAddresses.includes(addressObj.address)
      );
      console.log("Filtered Addresses:", filtered); // Log filtered addresses
      setFilteredAddresses2(filtered.length > 0 ? filtered : addresses2);
    };

    fetchFilteredAddresses();
  }, [deliveredChecked, receivedChecked, addresses2, Base_Url]);

  useEffect(() => {
    // Retrieve Token
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Token being used:", token);

    const fetchEventCounts = async () => {
      try {
        const response = await fetch(
          `${Base_Url}openPhoneEventData/all`,
          config
        );
        if (!response.ok) {
          throw new Error("Failed to fetch event counts");
        }
        const data = await response.json();
        setCounts(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchEventCounts();
  }, [Base_Url]); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Retrieve Token
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Token being used:", token);

    if (selectedAddress && selectedAddress !== "Search Address") {
      axios
        .get(
          `${Base_Url}openPhoneEventData/events?address=${encodeURIComponent(
            selectedAddress
          )}`,
          config
        )
        .then((response) => {
          const data = response.data.data;
          if (data && Array.isArray(data.events)) {
            setEventData(data.events);

            // Filter events to only include those with an address_id
            const eventsWithAddressId = data.events.filter(
              (event: any) => event.address_id
            );

            // Extract unique 'fromNumber' values from filtered events
            const uniqueNumbers = Array.from(
              new Set<string>(
                eventsWithAddressId.map((event: any) => event.from)
              )
            );
            setUniqueFromNumbers(uniqueNumbers);

            if (eventsWithAddressId.length > 0) {
              setPhoneNumber(eventsWithAddressId[0].to);
              setFromNumber(eventsWithAddressId[0].from);
            } else {
              setPhoneNumber("");
              setFromNumber("");
            }
            setMessageDelivered(data.messageDelivered || 0);
            setMessageResponse(data.messageResponse || 0);
            setCall(data.call || 0);
            setCallResponse(data.callResponse || 0);
          } else {
            console.error("Events data is not an array or is missing");
          }
        })
        .catch((error) => {
          console.error("Error fetching event data:", error);
        });
    }
  }, [selectedAddress, Base_Url]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log("Token being used:", token);

    const timer = setTimeout(async () => {
      async function fetchEvents() {
        try {
          const response = await axios.get(
            `${Base_Url}openPhoneEventData/events-by-address-and-from`,
            {
              params: {
                address_id: selectedAddressId,
                from_number: fromNumber,
              },
              ...config, // Pass fromNumber directly
            }
          );
          setEvents(response.data.data);
        } catch (error) {
        } finally {
        }
      }

      fetchEvents();
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedAddressId, fromNumber, Base_Url]);


  // useEffect(() => {
  //   setUpdatedMessages(groupedMessages);
  // }, [groupedMessages]);
  
  useEffect(() => {
    // Only update if groupedMessages is different
    if (JSON.stringify(groupedMessages) !== JSON.stringify(updatedMessages)) {
      setUpdatedMessages(groupedMessages);
    }
  }, [groupedMessages, updatedMessages]);

  const handleDefaultClick = () => {
    setFilterOption("all");
  };

  const handleCheckboxChange = (typeId: number) => {
    setSelectedAuctionTypes((prevSelected) => {
      if (prevSelected.includes(typeId)) {
        // Remove the filter if already selected
        return prevSelected.filter((id) => id !== typeId);
      } else {
        return [...prevSelected, typeId];
      }
    });
  };

  // Helper function to check if a date is within the last week
  const isWithinLastWeek = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return date >= oneWeekAgo;
  };

  // Helper function to check if a date is within the last month
  const isWithinLastMonth = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return date >= oneMonthAgo;
  };

  // Now filter and sort the addresses
  const filteredAddresses = addresses1
    .filter((address) => {
      // Apply your existing filter logic
      const matchesAuctionType =
        selectedAuctionTypes.length === 0 ||
        selectedAuctionTypes.includes(address.auction_event_id);
      const matchesBookmark =
        filterOption === "all" ||
        (filterOption === "bookmarked" && address.is_bookmarked) ||
        filterOption === "default";
      const matchesDateFilter =
        selectedDateFilter === "all" ||
        (selectedDateFilter === "weekly" &&
          isWithinLastWeek(address.created_at)) ||
        (selectedDateFilter === "monthly" &&
          isWithinLastMonth(address.created_at));
      const matchesCustomDateFilter =
        (!fromDate || new Date(address.created_at) >= new Date(fromDate)) &&
        (!toDate || new Date(address.created_at) <= new Date(toDate));
      const matchesSearch = address.displayAddress
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return (
        matchesAuctionType &&
        matchesBookmark &&
        matchesDateFilter &&
        matchesCustomDateFilter &&
        matchesSearch
      );
    })
    .sort((a: Address1, b: Address1) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const indexOfLastAddress = currentPage * addressesPerPage;
  const indexOfFirstAddress = indexOfLastAddress - addressesPerPage;

  const addressesToShow =
    filteredAddresses.length > 0 // If there are any filtered addresses
      ? filteredAddresses.filter((address) =>
        filteredAddresses2.some(
          (filteredAddress) => filteredAddress.address === address.address
        )
      )
      : [];

  const currentAddresses = addressesToShow.slice(
    indexOfFirstAddress,
    indexOfLastAddress
  );

  const totalPages = Math.ceil(addressesToShow.length / addressesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // console.log("addressesToShow", addressesToShow);

  const handleToggle = () => {
    setIsType(!isType);
  };
  const handleToggle1 = () => {
    setIsType((prevIsOpen) => !prevIsOpen);
  };

  const handleCustomDateToggle = () => {
    setIsCustomDateOpen(!isCustomDateOpen);
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setIsCustomDateOpen(true);
  };

  const handleSearchChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
  };

  const handleDeliveredChange = () => {
    setDeliveredChecked(!deliveredChecked);
  };

  const handleReceivedChange = () => {
    setReceivedChecked(!receivedChecked);
  };

  const handleBookmarkClick = (addressId: number) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found.");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const address = addresses1.find((a) => a.id === addressId);
    if (!address) return;

    const newIsBookmarked = !address.is_bookmarked;

    console.log(
      `Toggling bookmark status for address ID ${addressId} to ${newIsBookmarked}`
    );

    axios
      .post(
        `${Base_Url}bookmarks/${addressId}`,
        {
          is_bookmarked: newIsBookmarked,
        },
        config
      )
      .then((response) => {
        // Update the state only if the API call was successful
        setAddresses1((prevAddresses) =>
          prevAddresses.map((a) =>
            a.id === addressId ? { ...a, is_bookmarked: newIsBookmarked } : a
          )
        );
      })
      .catch((error) => {
        console.error("Error updating bookmark status:", error);
      });
  };

  const handlePinNumber = async (conversationId: string) => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const isPinned = pinnedConversations.has(conversationId);

      // API call to toggle pin/unpin
      const response = await axios.post(
        `${Base_Url}openPhoneEventData/toggle-number-pin/${conversationId}`,
        {},
        config
      );

      if (response.status === 200 || response.status === 201) {
        setPinnedConversations((prevState) => {
          const newSet = new Set<string>(prevState);

          if (isPinned) {
            newSet.delete(conversationId);
          } else {
            newSet.add(conversationId);
          }

          localStorage.setItem(
            "pinnedConversations",
            JSON.stringify([...newSet])
          );

          return newSet;
        });
      } else {
        console.error("API response not OK:", response.status, response.data);
      }
    } catch (error) {
      console.error("Error toggling the pin:", error);
    }
  };

  const toggleMessageExpansion = (index: any) => {
    setExpandedMessages((prev) => {
      const newExpandedMessages = new Map(prev);
      if (newExpandedMessages.has(index)) {
        newExpandedMessages.delete(index);
      } else {
        newExpandedMessages.set(index, true);
      }
      return newExpandedMessages;
    });
  };

  const handleAddressSelect = async (address: string, addressId: number) => {
    setSelectedAddress(address);
    setSelectedAddressId(addressId);
    setEventData([]);

    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (!token) {
      console.error("Authorization token is missing");
      return;
    }

    console.log("Token being used:", token);

    try {
      const response = await fetch(
        `${Base_Url}notifications/${addressId}/read?addressId=${addressId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      const result = await response.json();
      console.log(result.message); // Optional: handle success message

      // Update notification count in state
      setAddresses1((prevAddresses) =>
        prevAddresses.map((address) =>
          address.id === addressId
            ? { ...address, notificationCount: 0 }
            : address
        )
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const handleAddressSelect1 = (address: Address) => {
    setSelectedAddress(address.fullAddress);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  const handleSelectAddress = (address: Address) => {
    setInput(address.fullAddress);
    setResultsState([]);
  };

  const handleFilterChange = (type: "all" | "bookmarked" | "default") => {
    setFilterOption(type);
  };

  // Hook called unconditionally

  const toggleMessagePin = async (
    messageId: number,
    conversationId: string
  ) => {
    // Retrieve Token
    const token = localStorage.getItem("authToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("Token being used:", token);

    try {
      await axios.post(
        `${Base_Url}openPhoneEventData/toggle-message-pin/${messageId}`,
        null,
        config
      );

      setUpdatedMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        const conversationMessages = updatedMessages[conversationId].map(
          (msg) => {
            if (msg.id === messageId) {
              return {
                ...msg,
                is_message_pinned: !msg.is_message_pinned,
              };
            }
            return msg;
          }
        );
        updatedMessages[conversationId] = conversationMessages;
        return updatedMessages;
      });
    } catch (error) {
      console.error("Failed to toggle pin state:", error);
    }
  };

  const handleSearchToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTo(e.target.value);
  };

  // Filter messages based on the search query
  const filteredMessages = searchTo
    ? Object.keys(updatedMessages).filter((conversationId) =>
      updatedMessages[conversationId].some((message) =>
        message.to.toLowerCase().includes(searchTo.toLowerCase())
      )
    )
    : Object.keys(updatedMessages);

  // Function to format the count
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M"; // Convert to millions
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K"; // Convert to thousands
    }
    return count; // Return the original count if it's less than 1000
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid">
        <div className="ms-5  d-flex">
          <div className="border-end pe-2">
            <div className="mb-5 ms-5 fs-6 mt-2">
              <div>
                Message and Calls
                <div className="d-flex flex-column ">
                  <div className="container mb-1 ">
                    <div className="mt-4">
                      Status
                      {/* <span className=""> */}
                      <button
                        className="btn"
                        type="button"
                        onClick={handleToggle}
                        aria-expanded={isType}
                      >
                        <Image
                          src="/dropdownicon.svg"
                          alt="Dropdown Icon"
                          width={12}
                          height={12}
                        />
                      </button>
                      <div className={` ms-4${isType ? "show" : ""}`}>
                        <li className="dropdown-item">
                          <input
                            type="checkbox"
                            checked={deliveredChecked}
                            onChange={handleDeliveredChange}
                            className={styles.checkBox}
                          />
                          <label className="ms-2">Delivered</label>
                        </li>
                        <li className="dropdown-item pt-2">
                          <input
                            type="checkbox"
                            checked={receivedChecked}
                            onChange={handleReceivedChange}
                            id="notDelivered"
                            className={styles.checkBox}
                          />
                          <label className="ms-2" htmlFor="notDelivered">
                            Received
                          </label>
                        </li>
                      </div>
                      {/* </span> */}
                    </div>
                    <div className="mt-4">
                      Type
                      {/* <span className=""> */}
                      <button
                        className="btn"
                        type="button"
                        onClick={handleToggle1}
                        aria-expanded={isType}
                      >
                        <Image
                          src="/dropdownicon.svg"
                          alt="Dropdown Icon"
                          width={12}
                          height={12}
                        />
                      </button>
                      <div className={`ms-4${isType ? "show" : ""}`}>
                        <li className="dropdown-item">
                          <input
                            type="checkbox"
                            className={styles.checkBox}
                            id="case"
                            onChange={() => handleCheckboxChange(3)}
                          />
                          <label className="ms-2">Case</label>
                        </li>
                        <li className="dropdown-item pt-2">
                          <input
                            type="checkbox"
                            className={styles.checkBox}
                            id="auction"
                            onChange={() => handleCheckboxChange(1)}
                          />
                          <label className="ms-2" htmlFor="auction">
                            Auction
                          </label>
                        </li>
                        <li className="dropdown-item pt-2">
                          <input
                            type="checkbox"
                            className={styles.checkBox}
                            id="taxDeed"
                            onChange={() => handleCheckboxChange(2)}
                          />
                          <label className="ms-2" htmlFor="taxDeed">
                            Tax deed
                          </label>
                        </li>
                      </div>
                      {/* </span> */}
                    </div>
                    <div className="mt-4">
                      Date
                      {/* <span className="ms-2 mb-2"> */}
                      <button
                        className="btn"
                        type="button"
                        onClick={handleToggle1}
                        aria-expanded={isType}
                      >
                        <Image
                          src="/dropdownicon.svg"
                          alt="Dropdown Icon"
                          width={12}
                          height={12}
                        />
                      </button>
                      <div
                        className={`ms-4 dropdown-Date ${isType ? "show" : ""}`}
                      >
                        <li className="dropdown-item">
                          <input
                            type="checkbox"
                            id="weekly"
                            className={styles.checkBox}
                            onChange={() =>
                              setSelectedDateFilter(
                                selectedDateFilter === "weekly"
                                  ? "all"
                                  : "weekly"
                              )
                            }
                          />
                          <label className="ms-2" htmlFor="weekly">
                            Weekly{" "}
                          </label>
                        </li>
                        <li className="dropdown-item pt-2">
                          <input
                            type="checkbox"
                            id="monthly"
                            className={styles.checkBox}
                            onChange={() =>
                              setSelectedDateFilter(
                                selectedDateFilter === "monthly"
                                  ? "all"
                                  : "monthly"
                              )
                            }
                          />
                          <label className="ms-2" htmlFor="monthly">
                            Monthly{" "}
                          </label>
                        </li>
                      </div>
                      {/* </span> */}
                    </div>
                    <div className="">
                      <li className="dropdown-item ">
                        <label className="mt-4" htmlFor="pending">
                          Custom
                          <button
                            className="btn ms-2"
                            type="button"
                            onClick={handleCustomDateToggle}
                            aria-expanded={isCustomDateOpen}
                          >
                            <Image
                              src="/dropdownicon.svg"
                              alt="Dropdown Icon"
                              width={12}
                              height={12}
                            />
                          </button>
                        </label>

                        {isCustomDateOpen && (
                          <div className="custom-date-dropdown ms-1 ">
                            <div className="d-flex align-items-center">
                              <label
                                htmlFor="fromDate"
                                className="me-2 border-radius"
                              >
                                From:
                              </label>
                              <input
                                type="date"
                                id="fromDate"
                                className={`${styles.setDate}  me-2`}
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                              />
                            </div>
                            <div className="d-flex align-items-center mt-2">
                              <label htmlFor="toDate" className="me-2">
                                To:
                              </label>
                              <input
                                type="date"
                                id="toDate"
                                className={`${styles.setDate} ${styles.toDate} me-2`}
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                              />
                            </div>
                            <div className="ms-5">
                              <button
                                className="btn btn-primary px-2 py-1 mt-2 ms-5 "
                                type="button"
                                onClick={handleReset}
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>

          <div className="container-fluid ms-2 me-3">
            <div className={`row g-3 ${styles.comprenshiveAddress}`}>
              {/* Align the text and image above the first column */}
              <div className="col-12 d-flex  px-0">
                <Image
                  src="/Done.svg"
                  alt="Dropdown Icon"
                  width={25}
                  height={25}
                />
                <h5 className="ms-2">Comprehensive view of All Address</h5>
              </div>

              {/* First column: Message Delivered */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 ${styles.messageDelivered}`}
                >
                  <span>Message Delivered</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(counts.messageDelivered)}
                  </span>
                </div>
              </div>

              {/* Second column: Message Response */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 ${styles.messageResponse}`}
                >
                  <span>Message Response</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(counts.messageResponse)}
                  </span>
                </div>
              </div>

              {/* Third column: Call */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 text-left ${styles.call}`}
                >
                  <span>Call</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(counts.call)}
                  </span>
                </div>
              </div>

              {/* Fourth column: Call Response */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-2 text-left ${styles.callResponse}`}
                >
                  <span>Call Response</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(counts.callResponse)}
                  </span>
                </div>
              </div>
            </div>

            <div className="">
              <div className="text-left">
                <div className="row">
                  <div className="col-lg-3 col-md-12 col-sm-12 ">
                    <div className="d-flex mt-4">
                      <span className="me-4">
                        <Image
                          alt="Dropdown Icon"
                          width={25}
                          height={25}
                          src="/User.svg"
                        />
                      </span>
                      <span className={styles.address}>Address</span>
                    </div>
                    <div className="me-4 mt-2">
                      <div className={`${styles.addressBox} p-2`}>
                        <div className="d-flex align-items-center mt-1 gap-3">
                          <input
                            type="text"
                            placeholder="Search Address"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={` ps-4 bi bi-search  px-0 py-1 ${styles.seachAdd}`}
                          ></input>

                          <div className="d-flex">
                            <div
                              className={`me-2 ${filterOption === "bookmarked"
                                ? "active-filter"
                                : ""
                                }`}
                              onClick={() => handleFilterChange("bookmarked")}
                            >
                              <Image
                                alt="Bookmark Icon"
                                width={15}
                                height={15}
                                src="/bookmark.png"
                                className={`ms-2 ${filterOption === "bookmarked"
                                  ? styles.iconBlue
                                  : ""
                                  }`}
                              />{" "}
                              <div className={`me- ${styles.addFilter}`}>
                                Select
                              </div>
                            </div>

                            <div
                              className={`${filterOption === "default"} me-4`}
                              onClick={() => handleDefaultClick()}
                            >
                              <Image
                                src="/redo.svg"
                                alt="redo"
                                width={15}
                                height={15}
                                className={`ms-2 ${filterOption === "default"
                                  ? styles.iconBlue
                                  : ""
                                  }`}
                              />
                              <div className={`${styles.addFilter}`}>Default</div>
                            </div>
                          </div>
                        </div>
                        <div className={`${styles.addressList}`}>
                          <div className="">
                            {results.length > 0 && (
                              <SearchResultList
                                results={results}
                                onSelect={handleSelectAddress}
                              />
                            )}
                          </div>
                          {currentAddresses.length > 0 ? (
                            currentAddresses.map((address) => (
                              <li
                                key={address.id}
                                className={`d-flex align-items-left   mt-4 me-3 ${selectedAddressId === address.id
                                  ? styles.selectedAdd
                                  : ""
                                  }`}
                                onClick={() =>
                                  handleAddressSelect(
                                    address.displayAddress,
                                    address.id
                                  )
                                }
                              >
                                <div className="setaddress d-flex align-items-start gap-3">
                                  <i
                                    className={`bi ${address.is_bookmarked
                                      ? "bi-bookmark-fill"
                                      : "bi-bookmark"
                                      } ${address.is_bookmarked
                                        ? styles.bookmarked
                                        : styles.bookmarkIcon
                                      }`}
                                    onClick={() =>
                                      handleBookmarkClick(address.id)
                                    }
                                  ></i>

                                  <span className="text-start scroll">
                                    {address.displayAddress ||
                                      address.fullAddress}
                                    {address.notificationCount > 0 && (
                                      <span className="notification-count ml-2 text-success ms-1">
                                        ({address.notificationCount})
                                      </span>
                                    )}
                                  </span>
                                </div>

                                {address.fullAddress && (
                                  <div className="filtered-address">
                                    {address.fullAddress}
                                  </div>
                                )}
                              </li>
                            ))
                          ) : (
                            <p>No addresses found.</p>
                          )}
                        </div>
                      </div>
                      <span className="text-center">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="col">
                    <p className={`mt-4 ${styles.address}`}>
                      <i className="bi bi-bar-chart me-3"></i>
                      Analytic data of selected Address
                    </p>
                    <div className=""> 
                    <div className={`row g-3 ${styles.comprenshiveAddress}`}>
             

              {/* First column: Message Delivered */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 ${styles.AnlyDelivered}`}
                >
                  <span>Message Delivered</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(messageDelivered)}
                  </span>
                </div>
              </div>

              {/* Second column: Message Response */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 ${styles.AnlyResponse}`}
                >
                  <span>Message Response</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(messageResponse)}
                  </span>
                </div>
              </div>

              {/* Third column: Call */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 text-left ${styles.AnlyCall}`}
                >
                  <span>Call</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                    {formatCount(call)}
                  </span>
                </div>
              </div>

              {/* Fourth column: Call Response */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className={`d-flex justify-content-between align-items-center p-1 text-left ${styles.AnlyCallRes}`}
                >
                  <span>Call Response</span>
                  <span className="badge bg-light text-dark rounded-circle d-flex justify-content-center align-items-center p-3">
                  {formatCount(callResponse)}
                  </span>
                </div>
              </div>
            </div>
                    

                      <div className="conversation">
                        <div className="d-flex gap-3 justify-content-between align-items-center">
                          {selectedAddress && (
                            <div className="d-flex flex-wrap align-items-center gap-2">
                              <Image
                                src="converstation.svg"
                                alt=""
                                width={24}
                                height={24}
                              />{" "}
                              Conversation From{" "}
                              {uniqueFromNumbers.length > 0 && (
                                <select
                                  className={styles.conversationFrom}
                                  value={fromNumber}
                                  onChange={(e) =>
                                    setFromNumber(e.target.value)
                                  }
                                >
                                  {uniqueFromNumbers.map((number, index) => (
                                    <option key={index} value={number}>
                                      {number}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          )}

                          <div className="me-2 mt-4">
                            <input
                              className={`mb-1 text-left ps-4 py-1 ${styles.seachAdd}`}
                              type="search"
                              placeholder="Search To"
                              value={searchTo} // Bind input value to search state
                              onChange={handleSearchToChange} // Update search state on input change
                            />
                          </div>
                        </div>

                        <div className="container py-3">
                          <div className="card p-3">
                            <div className={`p-3 rounded-3 ${styles.chatBox}`}>
                              <div className="d-flex flex-column justify-content-end">
                                {events.length > 0
                                  ? filteredMessages.length > 0
                                    ? filteredMessages.map((conversationId) => {
                                      const isStop = updatedMessages[
                                        conversationId
                                      ].some((message) => message.is_stop);
                                      return (
                                        <div key={conversationId}>
                                          <div
                                            className={`${styles.toLine}`}
                                          ></div>
                                          <div
                                            className={` ${styles.toValue} text-center`}
                                          >
                                            <span className="text-dark">
                                              To{" "}
                                            </span>
                                            <span
                                              style={{
                                                color: isStop
                                                  ? "red"
                                                  : "inherit",
                                              }}
                                            >
                                              {
                                                updatedMessages[
                                                  conversationId
                                                ][0].to
                                              }
                                            </span>

                                            <i
                                              className={`bi pinnumber text-secondary ${pinnedConversations.has(
                                                conversationId
                                              )
                                                ? "bi-pin-fill"
                                                : "bi-pin"
                                                }`}
                                              onClick={() =>
                                                handlePinNumber(
                                                  conversationId
                                                )
                                              }
                                            ></i>
                                          </div>

                                          {updatedMessages[
                                            conversationId
                                          ].map((message, index) => (
                                            <div key={index}>
                                              <div
                                                className={
                                                  message.event_type_id === 1
                                                    ? styles.chatMessageRight
                                                    : styles.chatMessageLeft
                                                }
                                              >
                                                <div className="message-body-1">
                                                  {expandedMessages.has(
                                                    index
                                                  ) ? (
                                                    <div>
                                                      {message.body}
                                                      <button
                                                        onClick={() =>
                                                          toggleMessageExpansion(
                                                            index
                                                          )
                                                        }
                                                        className={`${styles.readLessBtn
                                                          } ${message.event_type_id ===
                                                            1
                                                            ? styles.readLessBtnRight
                                                            : styles.readLessBtnLeft
                                                          }`}
                                                      >
                                                        Read Less
                                                      </button>

                                                      <i
                                                        className={`bi ${message.is_message_pinned
                                                          ? "bi-star-fill text-warning"
                                                          : "bi-star"
                                                          } star-icon`}
                                                        onClick={() =>
                                                          toggleMessagePin(
                                                            message.id,
                                                            conversationId
                                                          )
                                                        }
                                                      ></i>
                                                    </div>
                                                  ) : (
                                                    <div>
                                                      {message.body &&
                                                        message.body.length >
                                                        100 ? (
                                                        <>
                                                          {message.body.substring(
                                                            0,
                                                            100
                                                          )}
                                                          ...
                                                          <button
                                                            onClick={() =>
                                                              toggleMessageExpansion(
                                                                index
                                                              )
                                                            }
                                                            className={`${styles.readMoreBtn
                                                              } ${message.event_type_id ===
                                                                1
                                                                ? styles.readMoreBtnRight
                                                                : styles.readMoreBtnLeft
                                                              }`}
                                                          >
                                                            Read More
                                                          </button>
                                                          <i
                                                            style={{
                                                              cursor:
                                                                "pointer",
                                                            }}
                                                            className={`bi ${message.is_message_pinned
                                                              ? "bi-star-fill text-warning"
                                                              : "bi-star"
                                                              } star-icon cursor-pointer`}
                                                            onClick={() =>
                                                              toggleMessagePin(
                                                                message.id,
                                                                conversationId
                                                              )
                                                            }
                                                          ></i>
                                                        </>
                                                      ) : (
                                                        <>
                                                          {message.body}{" "}
                                                          <i
                                                            className={`bi ${message.is_message_pinned
                                                              ? "bi-star-fill text-warning"
                                                              : "bi-star"
                                                              } star-icon`}
                                                            onClick={() =>
                                                              toggleMessagePin(
                                                                message.id,
                                                                conversationId
                                                              )
                                                            }
                                                          ></i>
                                                        </>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              <div
                                                className={
                                                  message.event_type_id === 1
                                                    ? styles.messageDateRight
                                                    : styles.messageDateLeft
                                                }
                                              >
                                                {new Date(
                                                  message.created_at
                                                ).toLocaleDateString()}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      );
                                    })
                                    : "No chats found for this number"
                                  : "Loading..."}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
