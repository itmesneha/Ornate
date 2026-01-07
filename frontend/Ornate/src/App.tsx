import { useState, useEffect } from 'react';
import type { Jewelry, SearchFilters } from './types/jewelry';
import { SearchBar } from './components/SearchBar';
import { JewelryGallery } from './components/JewelryGallery';
import { AddJewelryForm } from './components/AddJewelryForm';
import { EditJewelryForm } from './components/EditJewelryForm';
import { getAllJewellery, searchJewellery, createJewellery, updateJewellery } from './services/api';
import './App.css';

function App() {
  const [allJewelry, setAllJewelry] = useState<Jewelry[]>([]);
  const [filteredJewelry, setFilteredJewelry] = useState<Jewelry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJewelry, setEditingJewelry] = useState<Jewelry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load jewelry from backend on mount
  useEffect(() => {
    loadJewellery();
  }, []);

  const loadJewellery = async () => {
    try {
      setLoading(true);
      setError(null);
      const jewelry = await getAllJewellery();
      setAllJewelry(jewelry);
      setFilteredJewelry(jewelry);
    } catch (err) {
      setError('Failed to load jewelry collection');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      const results = await searchJewellery(filters);
      setFilteredJewelry(results);
    } catch (err) {
      setError('Failed to search jewelry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJewelry = async (jewelry: Jewelry) => {
    try {
      setLoading(true);
      setError(null);
      const newJewelry = await createJewellery(jewelry);
      setAllJewelry(prev => [...prev, newJewelry]);
      setFilteredJewelry(prev => [...prev, newJewelry]);
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add jewelry');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditJewelry = async (jewelry: Partial<Jewelry>) => {
    if (!jewelry.id) return;
    
    try {
      setLoading(true);
      setError(null);
      const updatedJewelry = await updateJewellery(jewelry.id, jewelry);
      
      // Update both arrays
      setAllJewelry(prev => prev.map(j => j.id === updatedJewelry.id ? updatedJewelry : j));
      setFilteredJewelry(prev => prev.map(j => j.id === updatedJewelry.id ? updatedJewelry : j));
      setEditingJewelry(null);
    } catch (err) {
      setError('Failed to update jewelry');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div style={{ 
            padding: '16px', 
            margin: '20px', 
            background: '#fee', 
            color: '#c33',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <SearchBar onSearch={handleSearch} />
        
        <div className="results-header">
          <h3>
            {loading ? 'Loading...' : 
              filteredJewelry.length === allJewelry.length
              ? `All Jewelry (${allJewelry.length})`
              : `Search Results (${filteredJewelry.length} of ${allJewelry.length})`
            }
          </h3>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#666' }}>
            Loading jewelry...
          </div>
        ) : (
          <JewelryGallery 
            items={filteredJewelry} 
            onEdit={(jewelry) => setEditingJewelry(jewelry)}
          />
        )}
      </main>

      {showAddForm && (
        <AddJewelryForm
          onSubmit={handleAddJewelry}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingJewelry && (
        <EditJewelryForm
          jewelry={editingJewelry}
          onSubmit={handleEditJewelry}
          onCancel={() => setEditingJewelry(null)}
        />
      )}
    </div>
  );
}

export default App;
