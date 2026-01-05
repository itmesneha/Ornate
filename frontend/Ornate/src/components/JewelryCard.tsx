import type { Jewelry } from '../types/jewelry';
import './JewelryCard.css';

interface JewelryCardProps {
  jewelry: Jewelry;
  onClick?: () => void;
}

export const JewelryCard = ({ jewelry, onClick }: JewelryCardProps) => {
  return (
    <div className="jewelry-card" onClick={onClick}>
      <div className="jewelry-image-container">
        <img 
          src={jewelry.imageUrl} 
          alt={jewelry.name}
          className="jewelry-image"
        />
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
