import React, { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import LoadingSpinner from "./LoadingSpinner";
import "./DataTable.css";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data available",
  emptyDescription = "There is no data to display at the moment.",
  sortable = true,
  pagination = true,
  rowsPerPage = 10,
}) => {
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortable) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection, sortable]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, rowsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (column) => {
    if (!column.sortable) return;

    if (sortColumn === column.key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column.key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (column) => {
    if (!column.sortable || sortColumn !== column.key) {
      return <FaSort className="sort-icon sort-icon--default" />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="sort-icon sort-icon--active" />
    ) : (
      <FaSortDown className="sort-icon sort-icon--active" />
    );
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="data-table-loading">
        <LoadingSpinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="data-table-empty">
        <div className="empty-state">
          <div className="empty-state__icon">📊</div>
          <h3 className="empty-state__title">{emptyMessage}</h3>
          <p className="empty-state__description">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="data-table">
      <div className="data-table__container">
        <table className="table">
          <thead className="table__header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`table__header-cell ${
                    column.sortable ? "table__header-cell--sortable" : ""
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column)}
                >
                  <div className="header-cell-content">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table__body">
            {paginatedData.map((row, index) => (
              <tr key={row.id || row._id || index} className="table__row">
                {columns.map((column) => (
                  <td key={column.key} className="table__cell">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="data-table__pagination">
          <div className="pagination-info">
            Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
            {Math.min(currentPage * rowsPerPage, sortedData.length)} of{" "}
            {sortedData.length} entries
          </div>

          <div className="pagination-controls">
            <button
              className="pagination-btn pagination-btn--prev"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <div className="pagination-numbers">
              {getPageNumbers().map((page, index) => (
                <button
                  key={index}
                  className={`pagination-number ${
                    page === currentPage ? "pagination-number--active" : ""
                  } ${page === "..." ? "pagination-ellipsis" : ""}`}
                  onClick={() => typeof page === "number" && goToPage(page)}
                  disabled={page === "..."}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="pagination-btn pagination-btn--next"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
