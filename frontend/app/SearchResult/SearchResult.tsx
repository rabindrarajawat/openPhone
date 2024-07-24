import React from 'react';
import "./SearchResult.css";

// Define the type for the props
interface SearchResultProps {
  result: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  return (
    <div className="search-result">
      {result}
    </div>
  );
};
