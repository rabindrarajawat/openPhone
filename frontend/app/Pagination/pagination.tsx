import React from 'react';
import './pagination.css'; // Import your CSS file

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageRange = 2; // Number of pages to show around the current page
  let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
  let endPage = Math.min(totalPages, startPage + pageRange - 1);

  // Adjust startPage if endPage is too close to totalPages
  if (endPage - startPage < pageRange - 1) {
    startPage = Math.max(1, endPage - pageRange + 1);
  }

  return (
    <nav className="pagination-container d-flex justify-content-center align-item-center mt-0">
      <ul className="pagination setPagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handlePrevious}>
            &lt;
          </button>
        </li>

        {startPage > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {startPage > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {[...Array(endPage - startPage + 1)].map((_, index) => (
          <li
            key={startPage + index}
            className={`page-item ${startPage + index === currentPage ? 'active' : ''}`}
          >
            <button className="page-link" onClick={() => onPageChange(startPage + index)}>
              {startPage + index}
            </button>
          </li>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button className="page-link" onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}

        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={handleNext}>
            &gt;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
