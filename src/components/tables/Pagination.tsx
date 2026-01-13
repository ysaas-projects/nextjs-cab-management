type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const startPage = Math.max(
    1,
    Math.min(currentPage - 1, totalPages - 2)
  );

  const pagesAroundCurrent = Array.from(
    { length: Math.min(3, totalPages) },
    (_, i) => startPage + i
  );

  return (
    <div className="flex items-center mt-4">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2.5 flex items-center h-10 justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex items-center gap-2">
        {startPage > 1 && <span className="px-2">...</span>}

        {pagesAroundCurrent.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium
              ${currentPage === page
                ? "bg-brand-500 text-white"
                : "text-gray-700 hover:bg-blue-500/10"
              }`}
          >
            {page}
          </button>
        ))}

        {startPage + 2 < totalPages && <span className="px-2">...</span>}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2.5 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-700 shadow-theme-xs hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
