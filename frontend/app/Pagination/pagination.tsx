import React from 'react';

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handler for Previous button
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handler for Next button
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    };
  };

  // Function to generate the range of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxAdjacentPages = 2; // Number of pages to show on each side of the current page

    // Always show first and last pages
    const firstPage = 1;
    const lastPage = totalPages;

    // Determine start and end pages
    let startPage = Math.max(currentPage - maxAdjacentPages, firstPage);
    let endPage = Math.min(currentPage + maxAdjacentPages, lastPage);

    // Adjust if near the start
    if (currentPage <= maxAdjacentPages + 1) {
      startPage = firstPage;
      endPage = Math.min(5, lastPage);
    }

    // Adjust if near the end
    if (currentPage >= lastPage - maxAdjacentPages) {
      startPage = Math.max(lastPage - 4, firstPage);
      endPage = lastPage;
    }

    // Add first page
    if (firstPage < startPage) {
      pageNumbers.push(
        <button
          key={firstPage}
          onClick={() => onPageChange(firstPage)}
          style={buttonStyle(firstPage === currentPage)}
        >
          {firstPage}
        </button>
      );

      if (startPage > firstPage + 1) {
        pageNumbers.push(
          <span key="start-ellipsis" style={{ margin: '0 5px' }}>
            ...
          </span>
        );
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          disabled={i === currentPage}
          style={buttonStyle(i === currentPage)}
        >
          {i}
        </button>
      );
    }

    // Add last page
    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pageNumbers.push(
          <span key="end-ellipsis" style={{ margin: '0 5px' }}>
            ...
          </span>
        );
      }

      pageNumbers.push(
        <button
          key={lastPage}
          onClick={() => onPageChange(lastPage)}
          style={buttonStyle(lastPage === currentPage)}
        >
          {lastPage}
        </button>
      );
    }

    return pageNumbers;
  };

  // Helper function for button styles
  const buttonStyle = (isActive: boolean) => ({
    margin: '0 5px',
    padding: '5px 10px',
    backgroundColor: isActive ? '#007bff' : '#fff',
    color: isActive ? '#fff' : '#000',
    border: '1px solid #007bff',
    borderRadius: '3px',
    cursor: isActive ? 'default' : 'pointer',
    disabled: isActive,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{ marginRight: '10px' }}
      >prev
      </button>

      {/* Page Summary */}
      <span style={{ marginRight: '10px' }}>
        Page {currentPage} of {totalPages}
      </span>

      {/* Page Numbers */}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{ marginLeft: '10px' }}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
