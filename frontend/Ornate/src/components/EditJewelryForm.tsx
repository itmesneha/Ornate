import { useState } from 'react';
import type { JewelryCategory, OutfitType, Jewelry } from '../types/jewelry';
import { JewelryCategory as JewelryCategoryValues, OutfitType as OutfitTypeValues } from '../types/jewelry';
import { uploadImage } from '../services/api';
import './AddJewelryForm.css';

interface EditJewelryFormProps {
  jewelry: Jewelry;
  onSubmit: (jewelry: Partial<Jewelry>) => void;
  onCancel: () => void;
}

export const EditJewelryForm = ({ jewelry, onSubmit, onCancel }: EditJewelryFormProps) => {
  const [name, setName] = useState(jewelry.name);
  const [category, setCategory] = useState<JewelryCategory>(jewelry.category);
  const [description, setDescription] = useState(jewelry.description || '');
  const [imageUrl, setImageUrl] = useState(jewelry.imageUrl);
  const [imagePreview, setImagePreview] = useState<string | null>(jewelry.imageUrl);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [color, setColor] = useState(jewelry.color || '');
  const [material, setMaterial] = useState(jewelry.material || '');
  const [selectedOutfits, setSelectedOutfits] = useState<OutfitType[]>(jewelry.outfitTypes);
  const [occasion, setOccasion] = useState(jewelry.occasion?.join(', ') || '');

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Set preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setImagePreview(jewelry.imageUrl);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleOutfitToggle = (outfit: OutfitType) => {
    setSelectedOutfits(prev =>
      prev.includes(outfit)
        ? prev.filter(o => o !== outfit)
        : [...prev, outfit]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedJewelry = {
      id: jewelry.id,
      name,
      category,
      description,
      imageUrl,
      color,
      material,
      outfitTypes: selectedOutfits,
      occasion: occasion ? occasion.split(',').map(o => o.trim()) : [],
    };
    
    onSubmit(updatedJewelry);
  };

  return (
    <div className="add-jewelry-overlay">
      <div className="add-jewelry-form">
        <div className="form-header">
          <h2>Edit Jewelry</h2>
          <button className="close-btn" onClick={onCancel}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gold Necklace"
              required
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
              {Object.values(JewelryCategoryValues).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Jewelry Image *</label>
            <div 
              className={`image-upload-zone ${dragActive ? 'drag-active' : ''} ${uploadingImage ? 'uploading' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-input-edit')?.click()}
            >
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <div className="image-overlay">
                    <span>Click or drag to change image</span>
                  </div>
                </div>
              ) : uploadingImage ? (
                <div className="upload-placeholder">
                  <div className="upload-spinner"></div>
                  <p>Uploading image...</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p>Drag & drop your jewelry image here</p>
                  <p className="upload-hint">or click to browse</p>
                  <small>Supports JPG, PNG, WEBP</small>
                </div>
              )}
              <input
                id="file-input-edit"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                style={{ display: 'none' }}
              />
            </div>
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
              {Object.values(OutfitTypeValues).map((outfit) => (
                <div
                  key={outfit}
                  className={`outfit-type-box ${selectedOutfits.includes(outfit) ? 'selected' : ''}`}
                  onClick={() => handleOutfitToggle(outfit)}
                >
                  {outfit}
                </div>
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
              disabled={!name || selectedOutfits.length === 0 || !imageUrl || uploadingImage}
            >
              {uploadingImage ? 'Uploading...' : 'Update Jewelry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
