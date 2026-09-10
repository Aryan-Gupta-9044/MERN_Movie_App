import { ChevronLeft, ChevronRight } from 'lucide-react';

function Pagination({ page, totalPages, onChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                className="page-btn"
                aria-label="Previous page"
            >
                <ChevronLeft className="icon-sm" />
            </button>
            <span className="page-status">Page {page} of {totalPages}</span>
            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                className="page-btn"
                aria-label="Next page"
            >
                <ChevronRight className="icon-sm" />
            </button>
        </div>
    );
}

export default Pagination;
