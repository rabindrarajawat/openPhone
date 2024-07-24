import React from 'react';
import "./SearchResultList.css";
import { SearchResult } from "../SearchResult/SearchResult";

// Define the type for the results array
interface SearchResultListProps {
  results: Array<{ fullAddress: string }>;
}

export const SearchResultList: React.FC<SearchResultListProps> = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, index) => (
        <SearchResult result={result.fullAddress} key={index} />
      ))}
    </div>
  );
};
