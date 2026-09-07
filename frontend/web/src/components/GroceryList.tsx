import React from 'react';

interface GroceryListProps {
  items: Record<string, string[]>;
}

export const GroceryList: React.FC<GroceryListProps> = ({ items }) => {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff', maxWidth: '400px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Shopping List</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {Object.entries(items).map(([ingredient, quantities], idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
            <span style={{ textTransform: 'capitalize' }}>{ingredient}</span>
            <span style={{ backgroundColor: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
              {quantities.join(" + ")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};