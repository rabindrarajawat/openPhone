"use client";

import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import SideBar from "../SideNavbar/sideNavbar";
import Image from "next/image";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { SearchResultList } from "../SearchResultList/SearchResultList";

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
  address:string;

}

interface Message {
  event_type_id: number;
  body: string;
  to: string;
  created_at: string;
  conversation_id: string;
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
  const [dropdownOpen, setDropdownOpen] = useState(true);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(true);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(true);
  const [box1DropdownOpen, setBox1DropdownOpen] = useState(false);
  const [isFollowUpClicked, setIsFollowUpClicked] = useState(false); // Add state for Follow-up button
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
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
  const dropdownToggleRef = useRef(null);
  const [isDate, setIsDate] = useState(true);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
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
  const [updateTrigger, setUpdateTrigger] = useState(false); // State to force re-render
  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(new Set<string>());
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveredChecked, setDeliveredChecked] = useState(false);
  const [receivedChecked, setReceivedChecked] = useState(false);
  const [addresses2, setAddresses2] = useState<Address1[]>([]);
  const [filteredAddresses2, setFilteredAddresses2] = useState<Address1[]>([]);



  useEffect(() => {
    const storedPins = localStorage.getItem("pinnedConversations");
    if (storedPins) {
      setPinnedConversations(new Set<string>(JSON.parse(storedPins)));
    }
  }, []);

  
  const [pinnedMessages, setPinnedMessages] = useState<Set<number>>(new Set());
  const [messages, setMessages] = useState<EventItem[]>([]);

  const handleDefaultClick = () => {
    setFilterOption("all");
  };

  const handleTimeFilterChange = (filter: "weekly" | "monthly") => {
    if (timeFilter === filter) {
      // If the same filter is clicked again, remove the filter
      setTimeFilter("all");
      setShowAllAddresses(true); // Show all addresses if no filters are selected
    } else {
      setTimeFilter(filter);
      setShowAllAddresses(false); // Hide all addresses until a filter is applied
    }
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

  const filteredAddresses = addresses1.filter((address) => {

    const matchesAuctionType = selectedAuctionTypes.length === 0 || selectedAuctionTypes.includes(address.auction_event_id);
    const matchesBookmark = filterOption === 'all' || (filterOption === 'bookmarked' && address.is_bookmarked) || (filterOption === 'default');
    const matchesDateFilter = selectedDateFilter === 'all' ||
      (selectedDateFilter === 'weekly' && isWithinLastWeek(address.created_at)) ||
      (selectedDateFilter === 'monthly' && isWithinLastMonth(address.created_at));
    const matchesCustomDateFilter = (!fromDate || new Date(address.created_at) >= new Date(fromDate)) &&
      (!toDate || new Date(address.created_at) <= new Date(toDate));

    // Apply the search filter
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
  });

  
  const addressesToShow = filteredAddresses.length > 0
  ? filteredAddresses.filter((address) => filteredAddresses2.some((filteredAddress) => filteredAddress.address === address.address))
  : filteredAddresses2.length > 0
    ? filteredAddresses2
    : addresses1;
  console.log("addressesToShow",addressesToShow);

  const handleToggle = () => {
    setIsType(!isType);
  };
  const handleToggle1 = () => {
    setIsType((prevIsOpen) => !prevIsOpen);
  };
  const handleDate = () => {
    setIsDate(!isDate);
  };

  const handleCustomDateToggle = () => {
    setIsCustomDateOpen(!isCustomDateOpen);
  };

  const handleDone = () => {
    setIsCustomDateOpen(true);
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

  const recordsPerPage = 6;

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "/" 
    }
  }, [router]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all addresses
        const addressResponse = await axios.get(
          "http://localhost:8000/address/getalladdress"
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
        console.log("formattedAddresses",formattedAddresses)



        // Fetch unread notifications
        const notificationResponse = await axios.get(
          "http://localhost:8000/notifications"
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

        // Set default selected address
        if (addressNotificationCounts.length > 0) {
          setSelectedAddress(addressNotificationCounts[0].displayAddress);
          setSelectedAddressId(addressNotificationCounts[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredAddresses = async () => {
      let deliveredAddresses = [];
      let receivedAddresses = [];

      if (deliveredChecked) {
        // Fetch delivered addresses
        const deliveredResponse = await axios.get('http://localhost:8000/openPhoneEventData?filter=delivered');
        deliveredAddresses = deliveredResponse.data.data
          .filter((event: { event_type_id: number; }) => event.event_type_id === 2)
          .map((event: { address: any; }) => event.address);
      }

      if (receivedChecked) {
        // Fetch received addresses
        const receivedResponse = await axios.get('http://localhost:8000/openPhoneEventData?filter=received');
        receivedAddresses = receivedResponse.data.data
          .map((event: { address: any; }) => event.address);
      }

      // Combine both delivered and received addresses
      const combinedAddresses = [...new Set([...deliveredAddresses, ...receivedAddresses])];

      // Filter the addresses based on the combined addresses
      const filtered = addresses2.filter((addressObj: { address: any; }) => combinedAddresses.includes(addressObj.address));
      console.log('Filtered Addresses:', filtered); // Log filtered addresses
      setFilteredAddresses2(filtered.length > 0 ? filtered : addresses2);
    };

    fetchFilteredAddresses();
  }, [deliveredChecked, receivedChecked, addresses2]);



  useEffect(() => {
    const fetchEventCounts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/openPhoneEventData/all"
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
  }, []); // Empty dependency array means this effect runs once on mount

  const handleDeliveredChange = () => {
    setDeliveredChecked(!deliveredChecked);
  };

  const handleReceivedChange = () => {
    setReceivedChecked(!receivedChecked);
  };

  const handleBookmarkClick = (addressId: number) => {
    const address = addresses1.find((a) => a.id === addressId);
    if (!address) return;

    const newIsBookmarked = !address.is_bookmarked;

    console.log(
      `Toggling bookmark status for address ID ${addressId} to ${newIsBookmarked}`
    );

    axios
      .post(`http://localhost:8000/bookmarks/${addressId}`, {
        is_bookmarked: newIsBookmarked,
      })
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
      const isPinned = pinnedConversations.has(conversationId);

      // API call to toggle pin/unpin
      const response = await axios.post(
        `http://localhost:8000/openPhoneEventData/toggle-number-pin/${conversationId}`
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

 

  useEffect(() => {
    if (selectedAddress && selectedAddress !== "Search Address") {
      axios
        .get(
          `http://localhost:8000/openPhoneEventData/events?address=${encodeURIComponent(
            selectedAddress
          )}`
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
  }, [selectedAddress]);

 

  
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

  

  const handlePageChange = (pageNumber: React.SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const handleFollowUpClick = () => {
    setIsFollowUpClicked(!isFollowUpClicked); // Toggle the Follow-up button state
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleStatusDropdown = () => {
    setStatusDropdownOpen(!statusDropdownOpen);
  };

  const toggleDateDropdown = () => {
    setDateDropdownOpen(!dateDropdownOpen);
  };

  const toggleBox1Dropdown = () => {
    setBox1DropdownOpen(!box1DropdownOpen);
  };

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prevSelectedOptions) => {
      if (prevSelectedOptions.includes(option)) {
        return prevSelectedOptions.filter((filter) => filter !== option);
      } else {
        return [...prevSelectedOptions, option];
      }
    });
  };

  const handleAddressSelect = (address: string, addressId: number) => {
    setSelectedAddress(address);
    setSelectedAddressId(addressId);
    setEventData([]);
  };

  const handleCheckboxClick = (addressId: any) => {
    axios
      .post(`http://localhost:8000/bookmarks/${addressId}`)
      .then((response) => {
        console.log("Bookmark added successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error adding bookmark:", error);
      });
  };
  const handleAddressSelect1 = (address: Address) => {
    setSelectedAddress(address.fullAddress);
  };

  


  const fetchData = async (value: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/address/search?address=${encodeURIComponent(
          value
        )}`
      );
      const results = response.data.results.filter((address: Address) =>
        address.fullAddress.toLowerCase().includes(value.toLowerCase())
      );
      setResultsState(results);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };



  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  const handleSelectAddress = (address: Address) => {
    setInput(address.fullAddress);
    setResultsState([]);
  
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      async function fetchEvents() {
        try {
          const response = await axios.get(
            "http://localhost:8000/openPhoneEventData/events-by-address-and-from",
            {
              params: {
                address_id: selectedAddressId,
                from_number: fromNumber,
              }, // Pass fromNumber directly
            }
          );
          setEvents(response.data.data);
        } catch (error) {
        } finally {
        }
      }

      fetchEvents();
    }, 700);
    return () => clearTimeout(timer);
  }, [selectedAddressId, fromNumber]);

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

  const handleFilterChange = (type: "all" | "bookmarked" | "default") => {
    setFilterOption(type);
  };



  const [updatedMessages, setUpdatedMessages] = useState(groupedMessages);
  console.log("🚀 ~ Dashboard ~ updatedMessages:", updatedMessages);

  useEffect(() => {
    setUpdatedMessages(groupedMessages);
  }, [events,groupedMessages]);

  const toggleMessagePin = async (
    messageId: number,
    conversationId: string
  ) => {
    try {
      await axios.post(
        `http://localhost:8000/openPhoneEventData/toggle-message-pin/${messageId}`
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
  return (
    <div>
      <Navbar
        toggleSidebar={toggleSidebar}
        onSelectAddress={handleAddressSelect1}
      />
      {isSidebarVisible && <SideBar />}
      <div className="main-container">
        <div className="content-with-border-right">
          <div className="openphone">
            <span className="border-bottom pb-3">OpenPhone</span>
          </div>
          <div className="">
            <div className="information">Message and Calls</div>
            <div className="main-dropdown">
              <div className="status">
                Status
                <span className="ms-2 mb-2 ">
                  <button
                    className="btn"
                    type="button"
                    onClick={handleToggle}
                    aria-expanded={isType}
                  >
                    <img src="/dropdownicon.svg" alt="Dropdown Icon" />
                  </button>

                  <ul className={`dropdown-type ${isType ? "show" : ""}`}>
                    <li className="dropdown-item">
                      <input type="checkbox"
                checked={deliveredChecked}
                onChange={handleDeliveredChange}
                      />
                      <label className="ms-2">Delivered</label>
                    </li>
                    <li className="dropdown-item pt-2">
                      <input type="checkbox" checked={receivedChecked}
                onChange={handleReceivedChange} 
                id="notDelivered" />
                      <label className="ms-2" htmlFor="notDelivered">
                        Received
                      </label>
                    </li>
                  </ul>
                </span>
              </div>
            </div>
            <div className="type">
              Type
              <span className="ms-2 mb-2 ">
                <button
                  className="btn"
                  type="button"
                  onClick={handleToggle1}
                  aria-expanded={isType}
                >
                  <img src="/dropdownicon.svg" alt="Dropdown Icon" />
                </button>

                <ul className={`dropdown-type ${isType ? "show" : ""}`}>
                  <li className="dropdown-item">
                    <input
                      type="checkbox"
                      className="checkbox"
                      id="case"
                      onChange={() => handleCheckboxChange(3)}
                    />
                    <label className="ms-2">Case</label>
                  </li>
                  <li className="dropdown-item pt-2">
                    <input
                      type="checkbox"
                      className="checkbox"
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
                      className="checkbox"
                      id="taxDeed"
                      onChange={() => handleCheckboxChange(2)}
                    />
                    <label className="ms-2" htmlFor="taxDeed">
                      Tax deed
                    </label>
                  </li>
                </ul>
              </span>
            </div>
            <div className="Date">
              Date
              <span className="ms-2 mb-2">
                <button
                  className="btn"
                  type="button"
                  onClick={handleToggle1}
                  aria-expanded={isType}
                >
                  <img src="/dropdownicon.svg" alt="Dropdown Icon" />
                </button>

                <ul className={`dropdown-Date ${isType ? "show" : ""}`}>
                  <li className="dropdown-item">
                    <input
                      type="checkbox"
                      id="weekly"
                      className="checkbox"
                      onChange={() =>
                        setSelectedDateFilter(
                          selectedDateFilter === "weekly" ? "all" : "weekly"
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
                      className="checkbox"
                      onChange={() =>
                        setSelectedDateFilter(
                          selectedDateFilter === "monthly" ? "all" : "monthly"
                        )
                      }
                    />
                    <label className="ms-2" htmlFor="monthly">
                      Monthly{" "}
                    </label>
                  </li>
                  <div className="custom">
                    <li className="dropdown-item pt-2">
                      <label className="custom" htmlFor="pending">
                        custom
                        <button
                          className="btn ms-2"
                          type="button"
                          onClick={handleCustomDateToggle}
                          aria-expanded={isCustomDateOpen}
                        >
                          <img src="/dropdownicon.svg" alt="Dropdown Icon" />
                        </button>
                      </label>

                      {isCustomDateOpen && (
                        <div className="custom-date-dropdown borderless">
                          <div className="d-flex align-items-center">
                            <label htmlFor="fromDate" className="me-2">
                              From:
                            </label>
                            <input
                              type="date"
                              id="fromDate"
                              className="set-date  me-2"
                              // placeholder="08/08/24"
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
                              className="set-date me-2 todate"
                              value={toDate}
                              onChange={(e) => setToDate(e.target.value)}
                            />
                          </div>
                          <div className="d-flex align-items-center mt-2 gap-2">
                           
                            <button
                              className="btn btn-primary btn btn-primary reset-button"
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
                </ul>
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="heading">
            <img src="/Done.svg" alt="" /> Comprehensive view of Address
          </div>
          <div className="logos-row-msg1">
            <div className="nav-msg1">
              <div className="message1">Message Delivered</div>
              <input
                type="text"
                className="round-input1"
                value={counts.messageDelivered}
                readOnly
              />
            </div>
            <div className="nav-msg1">
              <div className="message1 response ">Message Response</div>
              <input
                type="text"
                className="round-input1"
                value={counts.messageResponse}
                readOnly
              />
            </div>
            <div className="nav-msg1">
              <div className="message1 call-">Call </div>
              <input
                type="text"
                className="round-input1"
                value={counts.call}
                readOnly
              />
            </div>
            <div className="nav-msg1">
              <div className="message1 call-response">Call Response</div>
              <input
                type="text"
                className="round-input1"
                value={counts.callResponse}
                readOnly
              />
            </div>
          </div>
        </div>

        <div className="main-Address ">
          <span className="">
            {" "}
            <img src="/User.svg" alt="users" className="person-icon ms-4" />
          </span>
          <div className="Address ms-4">Address</div>
          <div className="main-search">
            <div className="search-box ">
              <span className="icon">
                <img src="/Icon.svg" alt="icon" />
              </span>
              <input
                type="text"
                placeholder="Search Address"
                value={searchQuery}
                onChange={handleSearchChange}
              ></input>
            </div>

            <div className="icon-labels">
              <div
                className={`bookmark-container text-center ${
                  filterOption === "bookmarked" ? "active-filter" : ""
                }`}
                onClick={() => handleFilterChange("bookmarked")}
              >
                <i className="bi bi-bookmark ms-4"></i>
                <div className="ms-4">Select all</div>
              </div>
              <div
                className="redo-container text-center"
                onClick={handleDefaultClick}
              >
                <img src="/redo.svg" alt="redo" className="ms-3" />
                <div>Default</div>
              </div>
            </div>
            <div>
            <div className="address-list">
  <div className="search-wrapper-add">
    {results.length > 0 && (
      <SearchResultList results={results} onSelect={handleSelectAddress} />
    )}
  </div>

  {addressesToShow.length > 0 ? (
    addressesToShow.map((address) => (
      <li
        key={address.id}
        className={`list-group-item justify-content-between ${
          selectedAddressId === address.id ? "selected-address" : ""
        }`}
        onClick={() => handleAddressSelect(address.displayAddress, address.id)}
      >
        <div className="setaddress d-flex align-items-center gap-3">
          <i
            className={`bi ${
              address.is_bookmarked ? "bi-bookmark-fill" : "bi-bookmark"
            } clickable-icon`}
            style={{
              cursor: "pointer",
              color: address.is_bookmarked ? "blue" : "grey",
            }}
            onClick={() => handleBookmarkClick(address.id)}
          ></i>

          <span className="ml-2">
            
            {address.displayAddress || address.fullAddress}
            {address.notificationCount > 0 && (
              <span className="notification-count ml-2">
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
          </div>
        </div>

        <div>
          <div className="Analyticdata ">
            <span>
              <i className="bi bi-bar-chart-line-fill"></i>
            </span>
            <span className="ms-4">Analytic Data of Selected Address</span>
          </div>
          <div className=" main-message">
            <div className="logos-row-msg">
              <div className="nav-msg">
                <div className="message Delivered">Message Delivered</div>
                <input
                  type="text"
                  className="round-input"
                  value={messageDelivered}
                  readOnly
                />
              </div>
              <div className="nav-msg">
                <div className="message response1 ">Message Response</div>
                <input
                  type="text"
                  className="round-input"
                  value={messageResponse}
                  readOnly
                />
              </div>
              <div className="nav-msg">
                <div className="message call-1">Call </div>
                <input
                  type="text"
                  className="round-input"
                  value={call}
                  readOnly
                />
              </div>
              <div className="nav-msg">
                <div className="message call-response-1">Call Response</div>
                <input
                  type="text"
                  className="round-input"
                  value={callResponse}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div className="conversation">
          {selectedAddress && (
            <div className="conversation-chat">
              <img src="converstation.svg" alt="" /> Conversation From {}
              {uniqueFromNumbers.length > 0 && (
                <select
                  value={fromNumber}
                  onChange={(e) => setFromNumber(e.target.value)} // Update fromNumber on selection
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

          <div className="search-wrapper ">
            <input className="search" type="search" placeholder="Search To" />
          </div>
          <div className="input-msg">
            <div className="screenshot-msg">
              <div className="inbox-chat">
                {events.length > 0
                  ? Object.keys(updatedMessages).map((conversationId) => {
                      const isStop = updatedMessages[conversationId].some(
                        (message) => message.is_stop
                      );
                      console.log(
                        "🚀 ~ Dashboard ~ isStop:",
                        updatedMessages,
                        isStop
                      );

                      return (
                        <div key={conversationId}>
                          <div className="to-line">.</div>
                          <div className="to-value">
                            <strong>To </strong>
                            <span style={{ color: isStop ? "red" : "inherit" }}>
                              {updatedMessages[conversationId][0].to}
                            </span>

                            <i
                              className={`bi pinnumber ${
                                pinnedConversations.has(conversationId)
                                  ? "bi-pin-fill text-primary"
                                  : "bi-pin"
                              }`}
                              onClick={() => handlePinNumber(conversationId)}
                            ></i>
                          </div>

                          {updatedMessages[conversationId].map(
                            (message, index) => (
                              <div key={index}>
                                <div
                                  className={
                                    message.event_type_id === 1
                                      ? "chat-message-right"
                                      : "chat-message-left"
                                  }
                                >
                                  <div className="message-body-1">
                                    {expandedMessages.has(index) ? (
                                      <div>
                                        {message.body}
                                        <button
                                          onClick={() =>
                                            toggleMessageExpansion(index)
                                          }
                                          className={`read-less-btn ${
                                            message.event_type_id === 1
                                              ? "read-less-btn-right"
                                              : "read-less-btn-left"
                                          }`}
                                        >
                                          Read Less
                                        </button>

                                        <i
                                          className={`bi ${
                                            message.is_message_pinned
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
                                        message.body.length > 100 ? (
                                          <>
                                            {message.body.substring(0, 100)}
                                            ...
                                            <button
                                              onClick={() =>
                                                toggleMessageExpansion(index)
                                              }
                                              className={`read-more-btn ${
                                                message.event_type_id === 1
                                                  ? "read-more-btn-right"
                                                  : "read-more-btn-left"
                                              }`}
                                            >
                                              Read More
                                            </button>
                                            <i
                                              style={{ cursor: "pointer" }}
                                              className={`bi ${
                                                message.is_message_pinned
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
                                          (
                                            <>
                                              {message.body}{" "}
                                              <i
                                                className={`bi ${
                                                  message.is_message_pinned
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
                                          ) || "No message body"
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div
                                  className={
                                    message.event_type_id === 1
                                      ? "message-date message-date-right"
                                      : "message-date message-date-left"
                                  }
                                >
                                  {new Date(
                                    message.created_at
                                  ).toLocaleDateString()}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })
                  : "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default Dashboard;
