import type { Jewelry } from '../types/jewelry';
import './JewelryCard.css';

interface JewelryCardProps {
  jewelry: Jewelry;
  onClick?: () => void;
  onEdit?: (jewelry: Jewelry) => void;
}

export const JewelryCard = ({ jewelry, onClick, onEdit }: JewelryCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(jewelry);
  };

  return (
    <div className="jewelry-card" onClick={onClick}>
      <div className="jewelry-image-container">
        <img 
          src={jewelry.imageUrl} 
          alt={jewelry.name}
          className="jewelry-image"
        />
        {onEdit && (
          <button className="edit-btn" onClick={handleEdit} title="Edit jewelry">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
        )}
      </div>
      <div className="jewelry-info">
        <h3 className="jewelry-name">{jewelry.name}</h3>
        <p className="jewelry-category">{jewelry.category}</p>
        {jewelry.description && (
          <p className="jewelry-description">{jewelry.description}</p>
        )}
        <div className="jewelry-tags">
          {jewelry.outfitTypes.map((outfit, index) => (
            <span key={index} className="tag">{outfit}</span>
          ))}
        </div>
        {jewelry.color && (
          <p className="jewelry-detail">Color: {jewelry.color}</p>
        )}
      </div>
    </div>
  );
};
