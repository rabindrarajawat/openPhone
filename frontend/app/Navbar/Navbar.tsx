import React from 'react';
import Image from 'next/image';

import './Navbar.css'



const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Image src="/line.svg" alt="Logo" className='logo1' width={50} height={50} />

                <div className="navbar-brand1" >OpenPhone <br />
                    <p className="dashboard" > Dashboard <a className='tracking'>/Tracking Page</a>  </p>
                </div>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <form className="d-flex" role="search">
                        <div className="search-wrapper">
                            <input className="search" type="search" placeholder="Search Address" aria-label="Search" />
                        </div>
                    </form>
                </div>
                <div className='profileicon'>
                    <Image src="/account_circle.svg" alt="bell " className='profile' width={50} height={50} />
                </div>

                <a className='name'>
                    Rishabh
                </a>


                <div className='bellicon'>
                    <Image src="/bell.svg" alt="Logo" className='bell' width={50} height={50} />
                </div>




            </div>
        </nav>
    );
};

export default Navbar;
