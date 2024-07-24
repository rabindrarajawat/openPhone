import React from "react";
import "./SearchResultList.css";

interface Address {
  fullAddress: string;
}

interface SearchResultsListProps {
  results: Address[];
  onSelect: (address: Address) => void;
}

export const SearchResultList: React.FC<SearchResultsListProps> = ({ results, onSelect }) => {
  return (
    <div className="results-list">
      {results.map((result, index) => (
        <div
          key={index}
          className="result-item"
          onClick={() => onSelect(result)}
        >
          {result.fullAddress}
        </div>
      ))}
    </div>
  );
};
