import { useState } from 'react';
import { JewelryCategory, OutfitType } from '../types/jewelry';
import './AddJewelryForm.css';

interface AddJewelryFormProps {
  onSubmit: (jewelry: any) => void;
  onCancel: () => void;
}

export const AddJewelryForm = ({ onSubmit, onCancel }: AddJewelryFormProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<JewelryCategory>(JewelryCategory.NECKLACE);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [selectedOutfits, setSelectedOutfits] = useState<OutfitType[]>([]);
  const [occasion, setOccasion] = useState('');

  const handleOutfitToggle = (outfit: OutfitType) => {
    setSelectedOutfits(prev =>
      prev.includes(outfit)
        ? prev.filter(o => o !== outfit)
        : [...prev, outfit]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const jewelry = {
      id: Date.now().toString(),
      name,
      category,
      imageUrl: imageUrl || 'https://via.placeholder.com/300',
      description,
      outfitTypes: selectedOutfits,
      color,
      material,
      occasion: occasion.split(',').map(o => o.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    onSubmit(jewelry);
  };

  return (
    <div className="add-jewelry-overlay">
      <div className="add-jewelry-form">
        <div className="form-header">
          <h2>Add New Jewelry</h2>
          <button onClick={onCancel} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Gold Hoop Earrings"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as JewelryCategory)}
              required
            >
              {Object.values(JewelryCategory).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">Image URL</label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <small>Leave empty for placeholder image</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe the jewelry piece..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="color">Color</label>
              <input
                id="color"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g., Gold, Silver"
              />
            </div>

            <div className="form-group">
              <label htmlFor="material">Material</label>
              <input
                id="material"
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g., Gold, Diamond"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Outfit Types *</label>
            <div className="checkbox-grid">
              {Object.values(OutfitType).map((outfit) => (
                <label key={outfit} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedOutfits.includes(outfit)}
                    onChange={() => handleOutfitToggle(outfit)}
                  />
                  <span>{outfit}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="occasion">Occasions (comma-separated)</label>
            <input
              id="occasion"
              type="text"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="e.g., Birthday, Anniversary, Party"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!name || selectedOutfits.length === 0}
            >
              Add Jewelry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
