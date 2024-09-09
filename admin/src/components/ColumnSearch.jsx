import React from 'react';

const ColumnSearch = ({ columns, onSearchChange }) => {
  const handleSearchChange = (e, key) => {
    const value = e.target.value;
    onSearchChange(key, value);
  };

  return (
    <>
      {columns.map((column) => (
        <div key={column.key}>
          <input
            type="text"
            placeholder={`Search by ${column.label}`}
            onChange={(e) => handleSearchChange(e, column.key)}
            className="mt-1 p-1 border border-gray-300 rounded w-full text-black text-sm font-sf-light"
          />
        </div>
      ))}
    </>
  );
};

export default ColumnSearch;