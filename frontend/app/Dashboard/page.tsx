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
  is_bookmarked: boolean;
  displayAddress: string;
  id: number;
  auction_event_id: number;
  created_at: string;
}

interface Message {
  event_type_id: number;
  body: string;
  to: string;
  created_at: string;
  conversation_id: string;
}

// interface GroupedMessages {
//   [conversationId: string]: Message[];
// }

// interface YourComponentProps {
//   events: Message[];
//   groupedMessages: GroupedMessages;
// }

// interface Event {
//   event_type_id: number;
//   body: string;
//   to: string;
//   created_at: string;
//   conversation_id: string;
// }

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
  const [addresses, setAddresses] = useState<string[]>([]); // State to store addresses
  const [eventData, setEventData] = useState<EventItem[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [fromNumber, setFromNumber] = useState("");
  const [selectedAddress1, setSelectedAddress1] = useState<string>("");
  const [apiResponseBody, setApiResponseBody] = useState<Message[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  // const [expandedMessages, setExpandedMessages] = useState<Set<number>>(
  //   new Set()
  // );

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [messageDelivered, setMessageDelivered] = useState<number>(0);
  const [messageResponse, setMessageResponse] = useState<number>(0);
  const [call, setCall] = useState<number>(0);
  const [callResponse, setCallResponse] = useState<number>(0);
  const [input, setInput] = useState<string>("");
  const [results, setResultsState] = useState<Address[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [addresses1, setAddresses1] = useState<Address1[]>([]);

  const [isOpen, setIsOpen] = useState(true);
  const [isType, setIsType] = useState(false);
  const dropdownToggleRef = useRef(null);
  const [isDate, setIsDate] = useState(true);
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);

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


  useEffect(() => {
    const storedPins = localStorage.getItem("pinnedConversations");
    if (storedPins) {
      setPinnedConversations(new Set<string>(JSON.parse(storedPins)));
    }
  }, []);

  // const [groupedMessage, setGroupedMessages] = useState<
  //   Record<string, EventItem[]>
  // >({});

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
    const matchesSearch = address.displayAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAuctionType && matchesBookmark && matchesDateFilter && matchesCustomDateFilter && matchesSearch;
  });
  const addressesToShow = filteredAddresses.length > 0 ? filteredAddresses : addresses1;

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
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

  const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchQuery(e.target.value);
  };

  const recordsPerPage = 6;

  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/address/getalladdress")
      .then((response) => {
        // console.log('API Response:', response.data);
        const formattedAddresses = response.data.map((item: any) => ({
          id: item.id,
          displayAddress: item.address,
          is_bookmarked: item.is_bookmarked,
          auction_event_id: item.auction_event_id,
          created_at: item.created_at,
        }));
        setAddresses1(formattedAddresses);

        if (formattedAddresses.length > 0) {
          setSelectedAddress(formattedAddresses[0].displayAddress);
          setSelectedAddressId(formattedAddresses[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, []);

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

      // Check for both 200 and 201 status codes
      if (response.status === 200 || response.status === 201) {
        // Update the pinned state
        setPinnedConversations((prevState) => {
          // Create a new Set from the previous state
          const newSet = new Set<string>(prevState);

          if (isPinned) {
            newSet.delete(conversationId); // Unpin if already pinned
          } else {
            newSet.add(conversationId); // Pin if not pinned
          }

          // Persist the updated pin state to localStorage
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

  // useEffect(() => {
  //  }, [pinnedConversations]);

  // useEffect(() => {
  //   if (selectedAddress && selectedAddress !== "Search Address") {
  //     axios
  //       .get(
  //         `http://localhost:8000/openPhoneEventData/events?address=${encodeURIComponent(
  //           selectedAddress
  //         )}`
  //       )
  //       .then((response) => {
  //         const data = response.data.data;
  //         if (data && Array.isArray(data.events)) {
  //           setEventData(data.events);
  //           if (data.events.length > 0) {
  //             setPhoneNumber(data.events[0].to);
  //             setFromNumber(data.events[0].from);
  //           } else {
  //             setPhoneNumber("");
  //             setFromNumber("");
  //           }
  //           setMessageDelivered(data.messageDelivered || 0);
  //           setMessageResponse(data.messageResponse || 0);
  //           setCall(data.call || 0);
  //           setCallResponse(data.callResponse || 0);
  //         } else {
  //           console.error("Events data is not an array or is missing");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching event data:", error);
  //       });
  //   }
  // }, [selectedAddress]);

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

  // const handleRowClick = (ownerId: number) => {
  //   if (selectedRowId !== ownerId) {
  //     setSelectedRowId(ownerId);
  //     console.log("Selected owner ID:", ownerId);

  //     axios
  //       .get<ApiResponse>(
  //         `http://localhost:8000/openPhoneEventData/events-by-conversation?conversation_id=${ownerId}`
  //       )
  //       .then((response) => {
  //         console.log("API response for selected owner ID:", response.data);
  //         setApiResponseBody(response.data.data); // Store the data array in state
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data for selected owner ID:", error);
  //       });
  //   }
  // };

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

  const filteredData = eventData.filter((event) => {
    if (
      selectedOptions.includes("delivered") &&
      selectedOptions.includes("received")
    ) {
      return event.event_type_id === 2 || event.event_type_id === 1;
    } else if (selectedOptions.includes("delivered")) {
      return event.event_type_id === 2;
    } else if (selectedOptions.includes("received")) {
      return event.event_type_id === 1;
    }
    return true;
  });

  const tableData = filteredData
    .filter(
      (event) => event.address_id !== null && event.address_id !== undefined
    )
    .map((event) => ({
      ownerid: event.conversation_id,
      PhoneNumber: event.to,
      Status: event.is_stop ? "Inactive" : "Active",
      Responses: event.is_stop ? "Stop" : "Interested",
    }));

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = tableData.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(tableData.length / recordsPerPage);

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
    setSelectedAddressId(addressId); // Update the selected address ID

    setEventData([]); // Clear existing event data to ensure new data is shown
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

  // useEffect(() => {
  //   if (tableData.length > 0) {
  //     // Set default selectedRowId only if it is not already set
  //     if (selectedRowId === null && tableData.length > 0) {
  //       const firstRowId = tableData[0].ownerid;
  //       setSelectedRowId(firstRowId);
  //       handleRowClick(firstRowId);
  //     }
  //   }
  // }, [tableData, selectedRowId]);

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
      // if (setResults) {
      //   setResults(results);
      // }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const handleRowClick = (ownerId: number) => {
  //     setSelectedRowId(ownerId);
  //     console.log('Selected owner ID:', ownerId);
  // };

  const toggleSidebar = () => {
    setIsSidebarVisible((prevState) => !prevState);
  };

  // const handleBookmarkClick = (index: any) => {
  //   const newBookmarkedAddresses = [...bookmarkedAddresses];
  //   newBookmarkedAddresses[index] = !newBookmarkedAddresses[index];
  //   setBookmarkedAddresses(newBookmarkedAddresses);
  // };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  const handleSelectAddress = (address: Address) => {
    setInput(address.fullAddress);
    setResultsState([]);
    // if (onSelectAddress) {
    //   onSelectAddress(address);
    // }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      async function fetchEvents() {
        try {
          const response = await axios.get('http://localhost:8000/openPhoneEventData/events-by-address-and-from', {
            params: { address_id: selectedAddressId, from_number: fromNumber } // Pass fromNumber directly
          });
          setEvents(response.data.data);
        } catch (error) {
          // setError('Error fetching event bodies');
        } finally {
          // setLoading(false);
        }
      }

      fetchEvents();
    }, 700); // 0.5 second delay

    // Cleanup function to clear the timeout if the dependencies change or the component unmounts
    return () => clearTimeout(timer);
  }, [selectedAddressId, fromNumber]);





  // Group messages by conversation_id
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

  // const toggleMessagePin = async (messageId: number) => {
  //   console.log("🚀 ~ toggleMessagePin ~ messageId:", messageId);
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8000/openPhoneEventData/toggle-message-pin/${messageId}`
  //     );
  //     console.log("API Response:", response.data);

  //     if (response.data && response.data.message) {
  //       // Update the local pinned messages state
  //       setPinnedMessages((prevPinnedMessages) => {
  //         const newPinnedMessages = new Set(prevPinnedMessages);
  //         if (newPinnedMessages.has(messageId)) {
  //           newPinnedMessages.delete(messageId);
  //         } else {
  //           newPinnedMessages.add(messageId);

  //         }
  //         return newPinnedMessages;
  //       });

  //       console.log("Pin status updated successfully");
  //     } else {
  //       console.error("Unexpected response format:", response.data);
  //     }
  //   } catch (error: any) {
  //     console.error("Error toggling message pin:", error);
  //     if (error.response) {
  //       console.error("Error response:", error.response.data);
  //     }
  //   }
  // };

  // const toggleMessagePin = async (messageId: number, message: any) => {
  //   console.log("🚀 ~ Dashboard ~ groupedMessages:", groupedMessages)

  //   console.log("🚀 ~ toggleMessagePin ~ message:", messageId, message);
  //   try {
  //     const response = await axios.post(
  //       `http://localhost:8000/openPhoneEventData/toggle-message-pin/${messageId}`
  //     );

  //     if (response.data && response.data.message) {
  //       // Update the specific message's is_message_pinned property first
  //       setMessages((prevMessages) =>
  //         prevMessages.map((msg) =>
  //           msg.id === messageId
  //             ? { ...msg, is_message_pinned: !msg.is_message_pinned }
  //             : msg
  //         )
  //       );

  //       // Then update the local pinned messages state
  //       setPinnedMessages((prevPinnedMessages) => {
  //         const newPinnedMessages = new Set(prevPinnedMessages);
  //         if (newPinnedMessages.has(messageId)) {
  //           newPinnedMessages.delete(messageId);
  //         } else {
  //           newPinnedMessages.add(messageId);
  //         }
  //         return newPinnedMessages;
  //       });
  //     } else {
  //       console.error("Unexpected response format:", response.data);
  //     }
  //   } catch (error: any) {
  //     console.error("Error toggling message pin:", error);
  //     if (error.response) {
  //       console.error("Error response:", error.response.data);
  //     }
  //   }
  // };

  const [updatedMessages, setUpdatedMessages] = useState(groupedMessages);
  console.log("🚀 ~ Dashboard ~ updatedMessages:", updatedMessages);

  useEffect(() => {
    // Update state whenever events change
    setUpdatedMessages(groupedMessages);
  }, [events]);

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
      {/* <Navbar onSelectAddress={handleAddressSelect1} /> */}
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
                      <input type="checkbox" />
                      <label className="ms-2">Delivered</label>
                    </li>
                    <li className="dropdown-item pt-2">
                      <input type="checkbox" id="notDelivered" />
                      <label className="ms-2" htmlFor="notDelivered">
                        received
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
                            {/* <button className="btn btn-primary done-button" type="button" onClick={handleDone}>
                              Done
                            </button> */}
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
              <input type="text" placeholder="Search Address" value={searchQuery}
                onChange={handleSearchChange}></input>
            </div>

            <div className="icon-labels">
              <div
                className={`bookmark-container text-center ${filterOption === "bookmarked" ? "active-filter" : ""
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
                    <SearchResultList
                      results={results}
                      onSelect={handleSelectAddress}
                    />
                  )}
                </div>

                {addressesToShow.length > 0 ? (
                  addressesToShow.map((address) => (
                    <li
                      key={address.id}
                      className={`list-group-item justify-content-between ${selectedAddressId === address.id
                        ? "selected-address"
                        : ""
                        }`}
                      onClick={() =>
                        handleAddressSelect(address.displayAddress, address.id)
                      }
                    >
                      <div className="setaddress d-flex align-items-center gap-3 ">
                        <i
                          className={`bi ${address.is_bookmarked
                            ? "bi-bookmark-fill"
                            : "bi-bookmark"
                            } clickable-icon`}
                          style={{
                            cursor: "pointer",
                            color: address.is_bookmarked ? "blue" : "grey",
                          }}
                          onClick={() => handleBookmarkClick(address.id)}
                        ></i>
                        <span className="ml-2">{address.displayAddress}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No addresses found.</p>
                )}
              </div>

              <div className="pagination-container">
                <ul className="pagination">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li
                      key={i}
                      className={`page-item ${currentPage === i + 1 ? "active" : ""
                        }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""
                      }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </li>
                </ul>
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
              <img src="converstation.svg" alt="" /> Conversation From { }
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
            <input
              className="search"
              type="search"
              placeholder="Search To"
            />
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
                            className={`bi pinnumber ${pinnedConversations.has(conversationId)
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
                                        className={`read-less-btn ${message.event_type_id === 1
                                          ? "read-less-btn-right"
                                          : "read-less-btn-left"
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
                                        message.body.length > 100 ? (
                                        <>
                                          {message.body.substring(0, 100)}
                                          ...
                                          <button
                                            onClick={() =>
                                              toggleMessageExpansion(index)
                                            }
                                            className={`read-more-btn ${message.event_type_id === 1
                                              ? "read-more-btn-right"
                                              : "read-more-btn-left"
                                              }`}
                                          >
                                            Read More
                                          </button>
                                          <i
                                            style={{ cursor: "pointer" }}
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
                                        message.body || "No message body"
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

      {/* <div className={`box ${isSidebarVisible ? "sidebar-visible" : ""}`}>
        <div className="mg-2">
          <div className="mg-1">
            <div className="open">OpenPhone</div>

            <div className="msg">Message and Calls</div>
            <div className={`msg dropdown ${dropdownOpen ? "show" : ""}`}>
              <button
                className="dropdown  dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
              >
                Status
              </button>
              <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-delivered"
                    checked={selectedOptions.includes("delivered")}
                    onChange={() => handleOptionToggle("delivered")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkbox-delivered"
                  >
                    Delivered
                  </label>
                </div>
                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-delivered"
                    checked={selectedOptions.includes("delivered")}
                    onChange={() => handleOptionToggle("delivered")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkbox-delivered"
                  >
                    Not Delivered
                  </label>
                </div>

                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-not-delivered"
                    checked={selectedOptions.includes("received")}
                    onChange={() => handleOptionToggle("received")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkbox-not-delivered"
                  >
                    Received
                  </label>
                </div>
              </div>
            </div>
            <div className={`dropdown dropdown-type  ${statusDropdownOpen ? "show" : ""}`}>
              <button
                className="dropdown status  dropdown-toggle"
                type="button"
                onClick={toggleStatusDropdown}
              >
                Type
              </button>
              <div
                className={`dropdown-menu  dropdown-type ${statusDropdownOpen ? "show" : ""}`}
              >
                <div className="form-check type  custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-case"
                    checked={selectedOptions.includes("case")}
                    onChange={() => handleOptionToggle("case")}
                  />
                  <label className="form-check-label" htmlFor="checkbox-case">
                    Case
                  </label>
                </div>

                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-auction"
                    checked={selectedOptions.includes("auction")}
                    onChange={() => handleOptionToggle("auction")}
                  />
                  <label className="form-check-label" htmlFor="checkbox-auction">
                    Auction
                  </label>
                </div>
                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-tax-deed"
                    checked={selectedOptions.includes("tax-deed")}
                    onChange={() => handleOptionToggle("tax-deed")}
                  />
                  <label className="form-check-label" htmlFor="checkbox-tax-deed">
                    Tax deed
                  </label>
                </div>
              </div>
            </div>
            <div className={`dropdown dropdown-date ${dateDropdownOpen ? "show" : ""}`}>
              <button
                className="dropdown date  dropdown-toggle"
                type="button"
                onClick={toggleDateDropdown}
              >
                Date
              </button>
              <div className={`dropdown-menu ${dateDropdownOpen ? "show" : ""}`}>
                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-weekly"
                    checked={selectedOptions.includes("Weekly")}
                    onChange={() => handleOptionToggle("Weekly")}
                  />
                  <label className="form-check-label" htmlFor="checkbox-weekly">
                    Weekly
                  </label>
                </div>

                <div className="form-check custom-dropdown-item">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="checkbox-monthly"
                    checked={selectedOptions.includes("Monthly")}
                    onChange={() => handleOptionToggle("Monthly")}
                  />
                  <label className="form-check-label" htmlFor="checkbox-monthly">
                    Monthly
                  </label>
                </div>

             
              </div>
          
            </div>
          </div>
        </div>

        <div className="box1 d-none d-sm-block">
         
          <div className="heading">
            <img src="Vector 310.svg" alt=""  height='' width='' /> Analytic Data of Selected Address</div>
          <div className="logos-row-msg">
            <div className="nav-msg">
              <div className="message">Message Delivered</div>
              <input
                type="text"
                className="round-input"
                value={messageDelivered}
                readOnly
              />
            </div>
            <div className="nav-msg">
              <div className="message response ">Message Response</div>
              <input
                type="text"
                className="round-input"
                value={messageResponse}
                readOnly
              />
            </div>
            <div className="nav-msg">
              <div className="message call-">Call </div>
              <input
                type="text"
                className="round-input"
                value={call}
                readOnly
              />
            </div>
            <div className="nav-msg">
              <div className="message call-response">Call Response</div>
              <input
                type="text"
                className="round-input"
                value={callResponse}
                readOnly
              />
            </div>
          </div>
        
          <div className="line"></div>

          <div className="tracking-container-box">

            <div >

              <div className="address"> <img src="User.svg" alt="" /> Address</div>
              <div className='address-list'>
                <div className="search-wrapper-add">
                  <input
                    className="search-to"
                    type="search"
                    placeholder="Search Address"
                    aria-label="Search"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                  />
                  {results.length > 0 && (
                    <SearchResultList results={results} onSelect={handleSelectAddress} />
                  )}
                  <img src="/Icon.svg" alt="icon" className="search-icon" />
                </div>

                {addresses1.length > 0 ? (
                  addresses1.map((address) => (
                    <li key={address.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onClick={() => handleAddressSelect(address.displayAddress, address.id)} // Pass the address ID on click
                    >
                      <div className="setaddress d-flex align-items-center gap-3 ">
                        <i
                          className={`bi ${address.is_bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'} clickable-icon`}
                          style={{ cursor: 'pointer', color: address.is_bookmarked ? 'blue' : 'grey' }}
                          onClick={() => handleBookmarkClick(address.id)}
                        ></i>
                        <span className="ml-2">{address.displayAddress}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No addresses found.</p>
                )}

              </div>
         
            </div>
          )}


            <div className="conversation"> <img src="converstation.svg" alt="" /> Conversation From {fromNumber}

              <div className="search-wrapper search-new">
                <input
                  className="search"
                  type="search"
                  placeholder="Search To"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {results.length > 0 && (
                  <SearchResultList results={results} onSelect={handleSelectAddress} />
                )}
              </div>



              <div className="input-msg">
             
                <div className="screenshot-msg">
                  <div className="inbox-chat">
                    {apiResponseBody.length > 0
                      ? apiResponseBody.map((message, index) => (
                        <div
                          key={index}
                          className={
                            message.event_type_id === 1
                              ? "chat-message-right"
                              : "chat-message-left"
                          }
                        >
                          {expandedMessages.has(index) ? (
                            <div>
                              {message.body}
                              <button
                                onClick={() => toggleMessageExpansion(index)}
                                className={`read-more-btn ${message.event_type_id === 1
                                  ? "read-more-btn-right"
                                  : "read-more-btn-left"
                                  }`}
                              >
                                Read Less
                              </button>
                            </div>
                          ) : (
                            <div>
                              {message.body && message.body.length > 100 ? (
                                <>
                                  {message.body.substring(0, 100)}...
                                  <button
                                    onClick={() => toggleMessageExpansion(index)}
                                    className={`read-more-btn ${message.event_type_id === 2 ? "read-more-btn-right" : "read-more-btn-left"
                                      }`}
                                  >
                                    Read More
                                  </button>
                                </>
                              ) : (
                                message.body || "No message body"
                              )}
                            </div>

                          )}
                        </div>
                      ))
                      : "Loading..."}
                  </div>
                </div>

         
              </div>
            </div>
          </div>

        </div >

      </div > */}
    </div>
  );
};

export default Dashboard;

