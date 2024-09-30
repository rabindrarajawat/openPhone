import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import styles from '../SideNavbar/SideNavbar.module.css';
import Image from 'next/image';
import Link from 'next/link'; // Import Link from Next.js

function Sidebar() {
  const router = useRouter(); // Initialize the router

  const handleLogout = () => {
    console.log("Logout clicked"); // Debugging line
    localStorage.removeItem("authToken"); // Remove the auth token
    router.push('/'); // Navigate to the home page after logging out
  };
 

  return (
    <>
     <nav className={`navbar position-fixed vh-100 p-2 d-flex flex-column ${styles.bgCustom}`}>
  <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1 mt-4">
    <div>
      <Link href="/Dashboard" legacyBehavior>
        <a className="d-flex flex-column align-items-center mt-4">
          <Image
            src="/upicon.svg"
            alt="Logo"
            className="logo2"
            width={50}
            height={50}
          />
          <span className="nav-link">Dashboard</span>
        </a>
      </Link>
    </div>

    <Link href="/conversationmapping" legacyBehavior>
      <a className="d-flex flex-column align-items-center mt-4">
        <Image
          src="/mapingi.svg"
          alt="Map Address"
          className="logo2"
          width={50}
          height={50}
        />
        <span className="nav-link">Map Address</span>
      </a>
    </Link>
  </div>

  {/* Use margin-top to push the logout button down */}
  <div className="mt-auto d-flex flex-column justify-content-end align-items-end mb-4 fs-6">
    <button className="btn btn-link p-0 text-decoration-none mb-5" onClick={handleLogout}>
      Logout
    </button>
  </div>
</nav>

    </>
  );
}

export default Sidebar;
