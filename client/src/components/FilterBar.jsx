import { Search, SlidersHorizontal, X } from 'lucide-react';

function FilterBar({
    searchTerm, onSearchChange,
    genre, onGenreChange, genres,
    year, onYearChange,
    sort, onSortChange,
    onClear,
}) {
    const hasActiveFilters = searchTerm || genre || year || sort !== 'relevance';
    const currentYear = new Date().getFullYear();

    return (
        <div className="filter-bar">
            <div className="search-input-wrap">
                <Search className="icon-sm search-icon" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by title…"
                    className="search-input"
                />
                {searchTerm && (
                    <button type="button" className="clear-input" onClick={() => onSearchChange('')} aria-label="Clear search">
                        <X className="icon-xs" />
                    </button>
                )}
            </div>

            <div className="filter-controls">
                <SlidersHorizontal className="icon-sm filter-icon" />

                <select value={genre} onChange={(e) => onGenreChange(e.target.value)} className="filter-select">
                    <option value="">All genres</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>

                <select value={year} onChange={(e) => onYearChange(e.target.value)} className="filter-select">
                    <option value="">Any decade</option>
                    {Array.from({ length: 11 }).map((_, i) => {
                        const decadeStart = Math.floor(currentYear / 10) * 10 - i * 10;
                        return <option key={decadeStart} value={decadeStart}>{decadeStart}s</option>;
                    })}
                </select>

                <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="filter-select">
                    <option value="relevance">Top rated</option>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A–Z</option>
                </select>

                {hasActiveFilters && (
                    <button type="button" className="clear-filters" onClick={onClear}>
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}

export default FilterBar;
