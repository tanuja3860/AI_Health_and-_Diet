'use client';

import React, { useState } from 'react';
import { MealCard } from '../components/MealCard';
import { GroceryList } from '../components/GroceryList';

export default function DashboardPage() {
  const [dailyCalories] = useState<number>(2150);

  const sampleGroceries = {
    "Oats": ["1 cup"],
    "Chicken Breast": ["200g"],
    "Quinoa": ["1/2 cup"],
    "Spinach": ["1 handful"]
  };

  return (
    <main style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', margin: 0 }}>AI Health & Diet Overview</h1>
        <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Your personalized daily nutrition dashboard</p>
      </header>

      <section style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, color: '#065f46', fontSize: '16px' }}>Target Daily Calories</h2>
        <p style={{ margin: '8px 0 0 0', fontSize: '32px', fontWeight: '900', color: '#047857' }}>{dailyCalories} kcal</p>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Today's Planned Meals</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          <MealCard title="Berry Oat Bowl" calories={420} protein={15} carbs={65} fats={8} />
          <MealCard title="Grilled Chicken Salad" calories={550} protein={45} carbs={20} fats={18} />
          <MealCard title="Salmon & Quinoa" calories={680} protein={40} carbs={50} fats={22} />
        </div>
      </section>

      <section>
        <GroceryList items={sampleGroceries} />
      </section>
    </main>
  );
}