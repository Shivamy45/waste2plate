"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

const foodTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'non-vegetarian', label: 'Non-Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
];

export default function FoodTypeFilter({ onFilterChange }) {
  const [selectedType, setSelectedType] = useState('all');

  const handleTypeChange = (type) => {
    setSelectedType(type);
    onFilterChange(type === 'all' ? null : type);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {foodTypes.map((type) => (
        <motion.button
          key={type.id}
          onClick={() => handleTypeChange(type.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedType === type.id
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {type.label}
        </motion.button>
      ))}
    </div>
  );
} 