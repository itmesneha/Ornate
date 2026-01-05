import type { Jewelry } from '../types/jewelry';
import { JewelryCard } from './JewelryCard';
import './JewelryGallery.css';

interface JewelryGalleryProps {
  items: Jewelry[];
  onItemClick?: (jewelry: Jewelry) => void;
}

export const JewelryGallery = ({ items, onItemClick }: JewelryGalleryProps) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <h3>No jewelry found</h3>
        <p>Try adjusting your search or add some jewelry to your collection</p>
      </div>
    );
  }

  return (
    <div className="jewelry-gallery">
      {items.map((jewelry) => (
        <JewelryCard
          key={jewelry.id}
          jewelry={jewelry}
          onClick={() => onItemClick?.(jewelry)}
        />
      ))}
    </div>
  );
};
