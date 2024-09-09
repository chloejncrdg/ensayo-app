import React, { useState } from 'react';
import ColumnSearch from './ColumnSearch';

const Table = ({ data, activeTab, onEdit, onView, currentPage, setCurrentPage, itemsPerPage }) => {
  const [filters, setFilters] = useState({});

  const columns = {
    courseSections: [
      { key: 'title', label: 'TITLE' },
      { key: 'actions', label: '' },
    ],
    courses: [
      { key: 'title', label: 'TITLE' },
      { key: 'courseSectionId.title', label: 'COURSE SECTION' },
      { key: 'actions', label: '' },
    ],
    modules: [
      { key: 'title', label: 'TITLE' },
      { key: 'courseId.title', label: 'COURSE' },
      { key: 'courseSectionId.title', label: 'COURSE SECTION' },
      { key: 'actions', label: '' },
    ],
    units: [
      { key: 'title', label: 'TITLE' },
      { key: 'moduleId.title', label: 'MODULE' },
      { key: 'courseId.title', label: 'COURSE' },
      { key: 'courseSectionId.title', label: 'COURSE SECTION' },
      { key: 'actions', label: '' },
    ],
    toolGroups: [
      { key: 'title', label: 'TITLE' },
      { key: 'unitId.title', label: 'UNIT' },
      { key: 'moduleId.title', label: 'MODULE' },
      { key: 'courseId.title', label: 'COURSE' },
      { key: 'view', label: '' },
      { key: 'edit', label: '' },
    ],
    tools: [
      { key: 'name', label: 'NAME' },
      { key: 'toolGroupId.title', label: 'TOOL GROUP' },
      { key: 'unitId.title', label: 'UNIT' },
      { key: 'moduleId.title', label: 'MODULE' },
      { key: 'courseId.title', label: 'COURSE' },
      { key: 'view', label: '' },
      { key: 'edit', label: '' },
    ],
    practicalGroups: [
      { key: 'title', label: 'TITLE' },
      { key: 'unitId.title', label: 'UNIT' },
      { key: 'moduleId.title', label: 'MODULE' },
      { key: 'courseId.title', label: 'COURSE' },
      { key: 'view', label: '' },
      { key: 'edit', label: '' },
    ],
  };

  const handleSearchChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1); // Reset to page 1 on search
  };

  const applyFilters = (item) => {
    for (const key in filters) {
      if (filters[key]) {
        let value = item[key];

        // Handle nested properties like courseSectionId.title
        if (key.includes('.')) {
          const keys = key.split('.'); // Split keys to handle nested objects
          value = keys.reduce((obj, k) => obj && obj[k], item);
        }

        // Convert value to string and lowercase for case-insensitive matching
        value = String(value).toLowerCase();

        const filterValue = filters[key].toLowerCase();

        // Check if value includes the filter value
        if (!value.includes(filterValue)) {
          return false;
        }
      }
    }
    return true;
  };

  const filteredData = data.filter(applyFilters);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const renderTableData = () => {
    return paginatedData.map((item) => (
      <tr key={item._id}>
        {activeTab === 'tools' ? (
          <>
            <td className="py-2 px-4 border-b">{item.name}</td>
            <td className="py-2 px-4 border-b">{item.toolGroupId.title}</td>
            <td className="py-2 px-4 border-b">{item.unitId.title}</td>
            <td className="py-2 px-4 border-b">{item.moduleId.title}</td>
            <td className="py-2 px-4 border-b">{item.courseId.title}</td>
          </>
        ) : (
          <>
            <td className="py-2 px-4 border-b">{item.title}</td>
            {activeTab === 'courses' && <td className="py-2 px-4 border-b">{item.courseSectionId.title}</td>}
            {activeTab === 'modules' && (
              <>
                <td className="py-2 px-4 border-b">{item.courseId.title}</td>
                <td className="py-2 px-4 border-b">{item.courseSectionId.title}</td>
              </>
            )}
            {activeTab === 'units' && (
              <>
                <td className="py-2 px-4 border-b">{item.moduleId.title}</td>
                <td className="py-2 px-4 border-b">{item.courseId.title}</td>
                <td className="py-2 px-4 border-b">{item.courseSectionId.title}</td>
              </>
            )}
            {['toolGroups', 'practicalGroups'].includes(activeTab) && (
              <>
                <td className="py-2 px-4 border-b">{item.unitId.title}</td>
                <td className="py-2 px-4 border-b">{item.moduleId.title}</td>
                <td className="py-2 px-4 border-b">{item.courseId.title}</td>
              </>
            )}
          </>
        )}
        <td className="py-2 px-4 border-b">
          {/* {['toolGroups', 'practicalGroups', 'tools'].includes(activeTab) ? ( */}
          {['toolGroups'].includes(activeTab) ? (
            <div className="flex items-center"> {/* Ensure buttons are within a flex container */}
              <button onClick={() => onView(item)} className="py-1 px-3 bg-blue-500 text-white mr-2 rounded">View</button>
              <button onClick={() => onEdit(item)} className="py-1 px-3 bg-yellow-500 text-white rounded">Edit</button>
            </div>
          ) : (
            <button onClick={() => onEdit(item)} className="py-1 px-3 bg-yellow-500 text-white rounded">Edit</button>
          )}
        </td>
      </tr>
    ));
  };
  

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div>
      <div className='flex justify-end mb-2 font-sf-regular'>
        <button
          onClick={handlePreviousPage}
          className={`py-1 px-3 ${currentPage === 1 ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded mx-1`}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className={`py-1 px-3 ${currentPage === totalPages ? 'bg-gray-200' : 'bg-blue-500 text-white'} rounded mx-1`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-custom-blue text-white font-sf-regular text-sm text-left">
            {columns[activeTab].map((column) => (
              <th key={column.key} className="py-2 px-4 border-b">
                <span>{column.label}</span>
              </th>
            ))}
          </tr>
          <tr>
            {columns[activeTab].map((column) =>
              column.key !== 'actions' && column.key !== 'view' && column.key !== 'edit' ? (
                <th key={column.key} className="py-2 px-4 border-b text-sf-regular">
                  <ColumnSearch columns={[column]} onSearchChange={handleSearchChange} className="w-full" />
                </th>
              ) : (
                <th key={column.key} className="py-2 px-4 border-b"></th>
              )
            )}
          </tr>
        </thead>
        <tbody className="font-sf-regular text-sm">{renderTableData()}</tbody>
      </table>

      <div className="mt-4 flex flex-col justify-between items-center font-sf-regular">
        <span className="text-sm">
          Showing {startIndex + 1} - {Math.min(endIndex, filteredData.length)} out of {filteredData.length}
        </span>
        <span className="text-sm">
          Page {currentPage} out of {totalPages}
        </span>
      </div>
    </div>
  );
};

export default Table;
