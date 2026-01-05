import { useState, useEffect } from 'react';
import type { Jewelry, SearchFilters } from './types/jewelry';
import { SearchBar } from './components/SearchBar';
import { JewelryGallery } from './components/JewelryGallery';
import { AddJewelryForm } from './components/AddJewelryForm';
import './App.css';

function App() {
  const [allJewelry, setAllJewelry] = useState<Jewelry[]>([]);
  const [filteredJewelry, setFilteredJewelry] = useState<Jewelry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load jewelry from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('jewelryCollection');
    if (stored) {
      const jewelry = JSON.parse(stored);
      setAllJewelry(jewelry);
      setFilteredJewelry(jewelry);
    }
  }, []);

  // Save to localStorage whenever jewelry changes
  useEffect(() => {
    if (allJewelry.length > 0) {
      localStorage.setItem('jewelryCollection', JSON.stringify(allJewelry));
    }
  }, [allJewelry]);

  const handleSearch = (filters: SearchFilters) => {
    let results = [...allJewelry];

    // Filter by category
    if (filters.category) {
      results = results.filter(item => item.category === filters.category);
    }

    // Filter by outfit type
    if (filters.outfitType) {
      results = results.filter(item =>
        item.outfitTypes.includes(filters.outfitType!)
      );
    }

    // Filter by search query (name, description, color)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.color?.toLowerCase().includes(query) ||
        item.material?.toLowerCase().includes(query)
      );
    }

    setFilteredJewelry(results);
  };

  const handleAddJewelry = (jewelry: Jewelry) => {
    const newJewelry = [...allJewelry, jewelry];
    setAllJewelry(newJewelry);
    setFilteredJewelry(newJewelry);
    setShowAddForm(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>✨ Ornate</h1>
          <p>Your Personal Jewelry Collection</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="add-btn">
          + Add Jewelry
        </button>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} />
        
        <div className="results-header">
          <h3>
            {filteredJewelry.length === allJewelry.length
              ? `All Jewelry (${allJewelry.length})`
              : `Search Results (${filteredJewelry.length} of ${allJewelry.length})`
            }
          </h3>
        </div>

        <JewelryGallery items={filteredJewelry} />
      </main>

      {showAddForm && (
        <AddJewelryForm
          onSubmit={handleAddJewelry}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

export default App;
