"use client";

import React, { useEffect, useState } from "react";
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
}

interface Message {
  event_type_id: number;
  body: string;
}

interface ApiResponse {
  message: string;
  data: Message[];
}

interface Event {
  event_type_id: number;
  body: string;
  to: string;
  created_at: string;
  conversation_id: string;
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
  const [input, setInput] = useState<string>('');
  const [results, setResultsState] = useState<Address[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [addresses1, setAddresses1] = useState<Address1[]>([]);

  const [uniqueFromNumbers, setUniqueFromNumbers] = useState<string[]>([]);

  // const [selectedAddress, setSelectedAddress] = useState(''); // For the display address
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  // const [fromNumber, setFromNumber] = useState('');

  const [events, setEvents] = useState<EventItem[]>([]);
  const [expandedMessages, setExpandedMessages] = useState(new Map());






  const [currentPage, setCurrentPage] = useState(1);
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
        console.log('API Response:', response.data);
        const formattedAddresses = response.data.map((item: any) => ({
          id: item.id,
          displayAddress: item.address,
          is_bookmarked: item.is_bookmarked,
        }));
        setAddresses1(formattedAddresses);

        if (formattedAddresses.length > 0) {
          setSelectedAddress(formattedAddresses[0].displayAddress); // Set the first address as the default selected address
          setSelectedAddressId(formattedAddresses[0].id); // Set the first address ID as the default selected address ID
        }
      })
      .catch((error) => {
        console.error("Error fetching addresses:", error);
      });
  }, []);



  const handleBookmarkClick = (addressId: number) => {
    const address = addresses1.find(a => a.id === addressId);
    if (!address) return;

    const newIsBookmarked = !address.is_bookmarked;

    console.log(`Toggling bookmark status for address ID ${addressId} to ${newIsBookmarked}`);

    axios.post(`http://localhost:8000/bookmarks/${addressId}`, {
      is_bookmarked: newIsBookmarked
    })
      .then(response => {
        console.log(`API Response for bookmarking:`, response.data);
        // Update the state only if the API call was successful
        setAddresses1(prevAddresses =>
          prevAddresses.map(a =>
            a.id === addressId
              ? { ...a, is_bookmarked: newIsBookmarked }
              : a
          )
        );
      })
      .catch(error => {
        console.error('Error updating bookmark status:', error);
      });
  };

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
            const eventsWithAddressId = data.events.filter((event: any) => event.address_id);

            // Extract unique 'fromNumber' values from filtered events
            const uniqueNumbers = Array.from(new Set<string>(eventsWithAddressId.map((event: any) => event.from)));
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
    axios.post(`http://localhost:8000/bookmarks/${addressId}`)
      .then(response => {
        console.log('Bookmark added successfully:', response.data);
      })
      .catch(error => {
        console.error('Error adding bookmark:', error);
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
      const response = await axios.get(`http://localhost:8000/address/search?address=${encodeURIComponent(value)}`);
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

  // function setEvents(data: any) {
  //   throw new Error("Function not implemented.");
  // }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get('http://localhost:8000/openPhoneEventData/events-by-address-and-from', {
          params: { address_id: selectedAddressId, from_number: fromNumber }
        });
        setEvents(response.data.data);
      } catch (error) {
        // setError('Error fetching event bodies');
      } finally {
        // setLoading(false);
      }
    }

    fetchEvents();
  }, [selectedAddress1, fromNumber]);

  // Group messages by conversation_id
  const groupedMessages = events.reduce<{ [key: string]: EventItem[] }>((acc, message) => {
    if (!acc[message.conversation_id]) {
      acc[message.conversation_id] = [];
    }
    acc[message.conversation_id].push(message);
    return acc;
  }, {});



  return (
    <div>
      {/* <Navbar onSelectAddress={handleAddressSelect1} /> */}
      <Navbar
        toggleSidebar={toggleSidebar}
        onSelectAddress={handleAddressSelect1}
      />
      {isSidebarVisible && <SideBar />}
      {/* <SideBar /> */}

      <div className={`box ${isSidebarVisible ? "sidebar-visible" : ""}`}>
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
            <div className={`dropdown ${statusDropdownOpen ? "show" : ""}`}>
              <button
                className="dropdown status  dropdown-toggle"
                type="button"
                onClick={toggleStatusDropdown}
              >
                Type
              </button>
              <div
                className={`dropdown-menu ${statusDropdownOpen ? "show" : ""}`}
              >
                <div className="form-check custom-dropdown-item">
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
            <div className={`dropdown ${dateDropdownOpen ? "show" : ""}`}>
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

                {/* <div className="form-check custom-dropdown-item">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkbox-custom"
                                checked={selectedOptions.includes('Custom')}
                                onChange={() => handleOptionToggle('Custom')}
                            />
                            <label className="form-check-label" htmlFor="checkbox-custom">
                                Custom
                            </label>
                        </div> */}
              </div>
              {/* <div className="form-check call custom-dropdown-item">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="checkbox-call"
                            checked={selectedOptions.includes('call')}
                            onChange={() => handleOptionToggle('call')}
                        />
                        <label className="form-check-label" htmlFor="checkbox-call">
                            Calls
                        </label>
                    </div> */}
            </div>
          </div>
        </div>

        <div className="box1 d-none d-sm-block">
          {/* <div
            className={`dropdown search-address-dropdown custom-dropdown ${box1DropdownOpen ? "show" : ""}`}
          >
            <button
              className="btn btn-secondary dropdown-toggle custom-dropdown-button"
              type="button"
              onClick={toggleBox1Dropdown}
            >
              {selectedAddress1}
              {selectedAddress}

              <Image
                src="/dropdownicon.svg"
                alt="Dropdown Icon"
                className={`dropdown-icon ${box1DropdownOpen ? "open" : ""}`}
                width={50}
                height={50}
              />
            </button>
            <div
              className={`dropdown-menu custom-dropdown-menu ${box1DropdownOpen ? "show" : ""}`}
            >
              {addresses.map((address, index) => (
                <div key={index} className="dropdown-item custom-dropdown-item d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                  />
                  <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address}
                  </button>
                </div>
              ))}
            </div>
          </div> */}


          {/* <div className="logos-row">
            <div className="nav1">
              <Image
                src="/follow.svg"
                alt="Follow-up Logo"
                className={`logo3 ${isFollowUpClicked ? "follow-up-heading" : ""
                  }`}
                width={50}
                height={50}
              />
              <label
                className={`Activity ${isFollowUpClicked ? "follow-up-heading" : ""
                  }`}
                htmlFor=""
                onClick={handleFollowUpClick}
              >
                Follow-up
              </label>
            </div>
            <div className="nav1">
              <Image
                src="/id.svg"
                alt="ID Logo"
                className="logo3"
                width={50}
                height={50}
              />
              <label className="Activity" htmlFor="">
                ID
              </label>
            </div>
            <div className="nav1">
              <Image
                src="/call.svg"
                alt="Call Logo"
                className="logo3"
                width={50}
                height={50}
              />
              <label className="Activity" htmlFor="">
                Call
              </label>
            </div>
            <div className="nav1">
              <Image
                src="/activity.svg"
                alt="Activity Logo"
                className="logo3"
                width={50}
                height={50}
              />
              <label className="Activity" htmlFor="">
                Activity
              </label>
            </div>
          </div> */}

          {/* <div className="line"></div> */}
          <div className="heading">
            <img src="done.svg" alt="" /> Comprehensive view of Address</div>
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
          {/* <div className="tracking-container">
            <div className="call-tracking">
              <Image
                src="/Vector.svg"
                alt="Activity Logo"
                className="vector"
                width={50}
                height={50}
              />
              <div className="text">Call tracking of search address </div>
            </div>
            <div className="follow-up">
              <div>
                <Image
                  src="/redo.svg"
                  alt="redo Logo"
                  className={`vector redo ${isFollowUpClicked ? "follow-up-heading" : ""
                    }`}
                  width={50}
                  height={50}
                />
                <div
                  className={`text-follow ${isFollowUpClicked ? "follow-up-heading" : ""
                    }`}
                >
                  Follow-up tracking of search address{" "}
                </div>
              </div>
            </div>
          </div>
          <div className="tracking-container-box">
            <div className="check-status">
              <div className="time  ">Times</div>
              <div className="vertical-line"></div>
              <div className="time">Duration</div>
              <div className="vertical-line"></div>
              <div className="time">Status</div>
              <div className="vertical-line"></div>
              <div className="time">Action</div>
            </div>
            <div
              className={`follow-status ${isFollowUpClicked ? "follow-up-heading" : ""
                }`}
            >
              <div className="time  ">Owner ID</div>
              <div className="vertical-line"></div>
              <div className="time">Status</div>
              <div className="vertical-line"></div>
              <div className="time">Last Follow-up</div>
            </div>
          </div>
          <div className="tracking-container">
            <div className="call-tracking">
              <Image
                src="/converstation.svg"
                alt="converstation Logo"
                className="vector"
                width={50}
                height={50}
              />
              <div className="text"> Conversation From {fromNumber}</div>
            </div>
            <div className="">
              <div>
                <Image
                  src="/msg.svg"
                  alt="msg Logo"
                  className="vector redo message-logo"
                  width={50}
                  height={50}
                />
                <div className="text-follow msg-follow">Message Detail </div>
              </div>
            </div>
          </div> */}
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
              {/* <div className="datatable-box ">
                <table className="table table-hover">
                  <thead>
                    <tr className='datatable'>
                      <th scope="col">Conversation ID</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">Status</th>
                      <th scope="col">Responses</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRecords.map((row, index) => (
                      <tr
                        key={index}
                        className={`center-align ${selectedRowId === row.ownerid ? 'selected-row' : ''}`}
                        onClick={() => handleRowClick(row.ownerid)}
                      >
                        <td>{row.ownerid}</td>
                        <td>{row.PhoneNumber}</td>
                        <td>{row.Status}</td>
                        <td className={row.Responses === 'Interested' ? 'interested' : row.Responses === 'Stop' ? 'stop' : ''}>
                          {row.Responses}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </div>
              <div className="pagination-container">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      &gt;
                    </button>
                  </li>
                </ul>
              </div> */}
            </div>


            <div className="conversation">

              {/* <img src="converstation.svg" alt="" /> Conversation From {fromNumber} */}

              {selectedAddress && (
                <div className="conversation">
                  <img src="converstation.svg" alt="" /> Conversation From { }
                  {uniqueFromNumbers.length > 0 && (
                    <select
                      value={fromNumber}
                      onChange={(e) => setFromNumber(e.target.value)}  // Update fromNumber on selection
                    >
                      {uniqueFromNumbers.map((number, index) => (
                        <option key={index} value={number}>{number}</option>
                      ))}
                    </select>
                  )}
                </div>
              )}


              <div className="search-wrapper search-new">
                {/* <Image src="/Icon.svg" alt="icon" className='search-icon' width={30} height={30} /> */}
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
                    {events.length > 0 ? (
                      Object.keys(groupedMessages).map((conversationId) => (
                        <div key={conversationId}>
                          <div className="to-line">.</div>
                          <div className="to-value">
                            <strong>To - </strong>{groupedMessages[conversationId][0].to}
                          </div>

                          {groupedMessages[conversationId].map((message, index) => (
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
                                    className={`read-less-btn ${message.event_type_id === 1
                                      ? "read-less-btn-right"
                                      : "read-less-btn-left"
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
                                        className={`read-more-btn ${message.event_type_id === 2
                                          ? "read-more-btn-right"
                                          : "read-more-btn-left"
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
                          ))}
                        </div>
                      ))
                    ) : (
                      "Loading..."
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div >
    </div >
  );
};

export default Dashboard;






// function setError(arg0: string) {
//   throw new Error("Function not implemented.");
// }

// function setLoading(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }
///////////////////////////////////////////////////////////////workcode//////////////////////////////////////////////
//////////////////////////////////////////////
/////////////////////////////////////
//////////////////////////////////
