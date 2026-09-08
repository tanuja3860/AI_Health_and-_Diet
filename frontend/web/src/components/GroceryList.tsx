'use client';

import React, { useState } from 'react';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

interface GroceryListProps {
  items?: GroceryItem[];
}

export default function GroceryList({ items = [] }: GroceryListProps) {
  const [list, setList] = useState<GroceryItem[]>(
    items.length > 0 ? items : [
      { id: '1', name: 'Organic Spinach', category: 'Vegetables', checked: false },
      { id: '2', name: 'Wild Salmon Fillet', category: 'Proteins', checked: false },
      { id: '3', name: 'Quinoa', category: 'Grains', checked: false },
      { id: '4', name: 'Avocado', category: 'Healthy Fats', checked: false },
    ]
  );

  const toggleCheck = (id: string) => {
    setList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">🛒 Dynamic Grocery Cart</h2>
      <ul className="space-y-2">
        {list.map((item) => (
          <li
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
              item.checked ? 'bg-slate-50 border-slate-200 text-slate-400 line-through' : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
            }`}
          >
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-500">{item.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}