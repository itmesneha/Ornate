export const JewelryCategory = {
  NECKLACE: 'Necklace',
  EARRINGS: 'Earrings',
  BRACELET: 'Bracelet',
  RING: 'Ring',
  ANKLET: 'Anklet',
  PENDANT: 'Pendant',
  SET: 'Set',
  OTHER: 'Other'
} as const;

export type JewelryCategory = typeof JewelryCategory[keyof typeof JewelryCategory];

export const OutfitType = {
  CASUAL: 'Casual',
  FORMAL: 'Formal',
  PARTY: 'Party',
  WEDDING: 'Wedding',
  TRADITIONAL: 'Traditional',
  ETHNIC: 'Ethnic',
  WESTERN: 'Western',
  FESTIVE: 'Festive',
  EVERYDAY: 'Everyday'
} as const;

export type OutfitType = typeof OutfitType[keyof typeof OutfitType];

export interface Jewelry {
  id: string;
  name: string;
  category: JewelryCategory;
  imageUrl: string;
  description?: string;
  outfitTypes: OutfitType[];
  color?: string;
  material?: string;
  occasion?: string[];
  createdAt: string;
}

export interface SearchFilters {
  category?: JewelryCategory;
  outfitType?: OutfitType;
  searchQuery?: string;
}

