import { useState } from 'react';
import { JewelryCategory, OutfitType } from '../types/jewelry';
import type { SearchFilters } from '../types/jewelry';
import './SearchBar.css';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<JewelryCategory | ''>('');
  const [outfitType, setOutfitType] = useState<OutfitType | ''>('');

  const handleSearch = () => {
    onSearch({
      searchQuery: searchQuery.trim() || undefined,
      category: category || undefined,
      outfitType: outfitType || undefined,
    });
  };

  const handleClear = () => {
    setSearchQuery('');
    setCategory('');
    setOutfitType('');
    onSearch({});
  };

  return (
    <div className="search-bar">
      <div className="search-header">
        <h2>Search Your Collection</h2>
        <p>Find jewelry by category, outfit type, or describe what you're wearing</p>
      </div>
      
      <div className="search-inputs">
        <div className="search-input-group">
          <label htmlFor="search-query">Search</label>
          <input
            id="search-query"
            type="text"
            placeholder="e.g., 'gold earrings' or 'wearing a red saree'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="category-filter">Category</label>
            <select
              id="category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value as JewelryCategory)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {Object.values(JewelryCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="outfit-filter">Outfit Type</label>
            <select
              id="outfit-filter"
              value={outfitType}
              onChange={(e) => setOutfitType(e.target.value as OutfitType)}
              className="filter-select"
            >
              <option value="">All Outfit Types</option>
              {Object.values(OutfitType).map((outfit) => (
                <option key={outfit} value={outfit}>{outfit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-actions">
          <button onClick={handleSearch} className="btn btn-primary">
            Search
          </button>
          <button onClick={handleClear} className="btn btn-secondary">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
