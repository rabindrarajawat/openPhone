"use client"

import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import SideBar from '../SideNavbar/sideNavbar';
import Image from 'next/image';
// import ReactPaginate from 'react-paginate';



import 'bootstrap/dist/css/bootstrap.min.css';
import './dashboard.css';

const Dashboard = () => {
    const [dropdownOpen, setDropdownOpen] = useState(true);
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(true);
    const [dateDropdownOpen, setDateDropdownOpen] = useState(true);
    const [box1DropdownOpen, setBox1DropdownOpen] = useState(false);

    const [isFollowUpClicked, setIsFollowUpClicked] = useState(false); // Add state for Follow-up button


    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedAddress, setSelectedAddress] = useState('Search Address');



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

    const handleOptionToggle = (option: string) => { // Ensure option is explicitly typed as string
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const handleAddressSelect = (address: string) => {
        setSelectedAddress(address);
        setBox1DropdownOpen(false); // Close the dropdown after selection
    };


    const tableData = [
        { id: 1, ownerid: '011045', PhoneNumber: '889945694', Status: 'Dead', Responses: "Stop" },
        { id: 2, ownerid: '011045', PhoneNumber: '889945694', Status: 'Initial', Responses: "Intrested" },
        { id: 3, ownerid: '011045', PhoneNumber: '889945694', Status: 'Prospect', Responses: "Intrested" },
        { id: 4, ownerid: '011045', PhoneNumber: '889945694', Status: 'Dead', Responses: "Stop" },
        { id: 5, ownerid: '011045', PhoneNumber: '889945694', Status: 'Converted', Responses: "Intrested" },
        { id: 6, ownerid: '011045', PhoneNumber: '889945694', Status: 'Prospect', Responses: "Intrested" },
    ];



    return (
        <div>
            <Navbar />
            <SideBar />
            <div className='box'>
                <div className='msg'>Message and Calls</div>
                <div className={`dropdown ${dropdownOpen ? 'show' : ''}`}>
                    <button className="dropdown  dropdown-toggle" type="button" onClick={toggleDropdown}>
                        Status
                    </button>
                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                        <div className="form-check custom-dropdown-item">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkbox-delivered"
                                checked={selectedOptions.includes('delivered')}
                                onChange={() => handleOptionToggle('delivered')}
                            />
                            <label className="form-check-label" htmlFor="checkbox-delivered">
                                Delivered
                            </label>
                        </div>

                        <div className="form-check custom-dropdown-item">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkbox-not-delivered"
                                checked={selectedOptions.includes('not delivered')}
                                onChange={() => handleOptionToggle('not delivered')}
                            />
                            <label className="form-check-label" htmlFor="checkbox-not-delivered">
                                Not Delivered
                            </label>
                        </div>
                        <div className="form-check custom-dropdown-item">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkbox-pending"
                                checked={selectedOptions.includes('pending')}
                                onChange={() => handleOptionToggle('pending')}
                            />
                            <label className="form-check-label" htmlFor="checkbox-pending">
                                Pending
                            </label>
                        </div>
                    </div>
                </div>
                <div className={`dropdown ${statusDropdownOpen ? 'show' : ''}`}>
                    <button className="dropdown status  dropdown-toggle" type="button" onClick={toggleStatusDropdown}>
                        Type
                    </button>
                    <div className={`dropdown-menu ${statusDropdownOpen ? 'show' : ''}`}>
                        <div className="form-check custom-dropdown-item">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkbox-case"
                                checked={selectedOptions.includes('case')}
                                onChange={() => handleOptionToggle('case')}
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
                                checked={selectedOptions.includes('auction')}
                                onChange={() => handleOptionToggle('auction')}
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
                                checked={selectedOptions.includes('tax-deed')}
                                onChange={() => handleOptionToggle('tax-deed')}
                            />
                            <label className="form-check-label" htmlFor="checkbox-tax-deed">
                                Tax deed
                            </label>
                        </div>
                    </div>
                </div>
                <div className={`dropdown ${dateDropdownOpen ? 'show' : ''}`}>
                    <button className="dropdown date  dropdown-toggle" type="button" onClick={toggleDateDropdown}>
                        Date
                    </button>
                    <div className={`dropdown-menu ${dateDropdownOpen ? 'show' : ''}`}>
                        <div className="form-check custom-dropdown-item">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="checkbox-weekly"
                                checked={selectedOptions.includes('Weekly')}
                                onChange={() => handleOptionToggle('Weekly')}
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
                                checked={selectedOptions.includes('Monthly')}
                                onChange={() => handleOptionToggle('Monthly')}
                            />
                            <label className="form-check-label" htmlFor="checkbox-monthly">
                                Monthly
                            </label>
                        </div>
                        <div className="form-check custom-dropdown-item">
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
                        </div>
                    </div>
                    <div className="form-check call custom-dropdown-item">
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
                    </div>
                </div>

                <div className='box1'>
                    <div className={`dropdown search-address-dropdown ${box1DropdownOpen ? 'show' : ''}`}>
                        <button className="btn btn-secondary dropdown-toggle" type="button" onClick={toggleBox1Dropdown}>
                            {selectedAddress}
                        </button>
                        <div className={`dropdown-menu ${box1DropdownOpen ? 'show' : ''}`}>
                            <a className="dropdown-item" href="#" onClick={() => handleAddressSelect('Address 00012')}>Address 00012</a>
                            <a className="dropdown-item" href="#" onClick={() => handleAddressSelect('Address 00013')}>Address 00013</a>
                            <a className="dropdown-item" href="#" onClick={() => handleAddressSelect('Address 00014')}>Address 00014</a>
                            <a className="dropdown-item" href="#" onClick={() => handleAddressSelect('Address 00015')}>Address 00015</a>
                            <a className="dropdown-item" href="#" onClick={() => handleAddressSelect('Address 00016')}>Address 00016</a>
                        </div>
                    </div>


                    <div className="logos-row">
                        <div className="nav1">
                            <Image src="/follow.svg" alt="Follow-up Logo" className={`logo3 ${isFollowUpClicked ? 'follow-up-heading' : ''}`} width={50} height={50} />
                            <label className={`Activity ${isFollowUpClicked ? 'follow-up-heading' : ''}`} htmlFor="" onClick={handleFollowUpClick}>Follow-up</label>
                        </div>
                        <div className="nav1">
                            <Image src="/id.svg" alt="ID Logo" className='logo3' width={50} height={50} />
                            <label className='Activity' htmlFor="">ID</label>
                        </div>
                        <div className="nav1">
                            <Image src="/call.svg" alt="Call Logo" className='logo3' width={50} height={50} />
                            <label className='Activity' htmlFor="">Call</label>
                        </div>
                        <div className="nav1">
                            <Image src="/activity.svg" alt="Activity Logo" className='logo3' width={50} height={50} />
                            <label className='Activity' htmlFor="">Activity</label>
                        </div>
                    </div>

                    <div className='line'></div>
                    <div className='heading'>Comprehensive view of Address</div>
                    <div className="logos-row-msg">
                        <div className="nav-msg">
                            <div className='message'>Message Delivered</div>
                            <input type="text" className="round-input" placeholder="5" readOnly />
                        </div>
                        <div className="nav-msg">
                            <div className='message response '>Message Response</div>
                            <input type="text" className="round-input" placeholder="5" readOnly />
                        </div>
                        <div className="nav-msg">
                            <div className='message call-'>Call </div>
                            <input type="text" className="round-input" placeholder="5" readOnly />
                        </div>
                        <div className="nav-msg">
                            <div className='message call-response'>Call Response</div>
                            <input type="text" className="round-input" placeholder="5" readOnly />
                        </div>
                    </div>
                    <div className='tracking-container'>
                        <div className='call-tracking'>
                            <Image src="/vector.svg" alt="Activity Logo" className='vector' width={50} height={50} />
                            <div className='text'>Call tracking of search address </div>
                        </div>
                        <div className='follow-up'>
                            <div>
                                <Image src="/redo.svg" alt="redo Logo" className={`vector redo ${isFollowUpClicked ? 'follow-up-heading' : ''}`} width={50} height={50} />
                                <div className={`text-follow ${isFollowUpClicked ? 'follow-up-heading' : ''}`}>Follow-up tracking of search address </div>
                            </div>
                        </div>
                    </div>
                    <div className='tracking-container-box'>
                        <div className='check-status'>
                            <div className='time  '>Times</div>
                            <div className='vertical-line'></div>
                            <div className='time'>Duration</div>
                            <div className='vertical-line'></div>
                            <div className='time'>Status</div>
                            <div className='vertical-line'></div>
                            <div className='time'>Action</div>
                        </div>
                        <div className={`follow-status ${isFollowUpClicked ? 'follow-up-heading' : ''}`} >
                            <div className='time  '>Owner ID</div>
                            <div className='vertical-line'></div>
                            <div className='time'>Status</div>
                            <div className='vertical-line'></div>
                            <div className='time'>Last Follow-up</div>
                        </div>
                    </div>
                    <div className='tracking-container'>
                        <div className='call-tracking'>
                            <Image src="/converstation.svg" alt="converstation Logo" className='vector' width={50} height={50} />
                            <div className='text'>Converation From 8827145468 </div>
                        </div>
                        <div className=''>
                            <div>
                                <Image src="/msg.svg" alt="msg Logo" className='vector redo' width={50} height={50} />
                                <div className='text-follow '>Message Detail </div>
                            </div>
                        </div>
                    </div>
                    <div className='tracking-container-box' >
                        <div className='datatable-box '>
                            <table className="table table-hover ">
                                <thead>
                                    <tr className='datatable'>
                                        <th scope="col">Owner'ID</th>
                                        <th scope="col">Phone Number</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Responses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((row: any) => (
                                        <tr key={row.id} className="center-align">
                                            {/* <th scope="row">{row.id}</th> */}
                                            <td>{row.ownerid}</td>
                                            <td>{row.PhoneNumber}</td>
                                            <td>{row.Status}</td>
                                            <td>{row.Responses}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className='input-msg'>
                            <div className='screenshot-msg'></div>
                        </div>


                    </div>



                </div>



            </div>
        </div>
    );
};

export default Dashboard;