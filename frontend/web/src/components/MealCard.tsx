import React from 'react';

interface MealCardProps {
  title: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export const MealCard: React.FC<MealCardProps> = ({ title, calories, protein, carbs, fats }) => {
  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', backgroundColor: '#ffffff' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#0f172a' }}>{title}</h3>
      <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0 0 12px 0' }}>{calories} kcal</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '8px', fontSize: '12px' }}>
        <span><strong>{protein}g</strong> Protein</span>
        <span><strong>{carbs}g</strong> Carbs</span>
        <span><strong>{fats}g</strong> Fats</span>
      </div>
    </div>
  );
};