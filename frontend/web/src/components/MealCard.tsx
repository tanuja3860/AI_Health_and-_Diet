'use client';

import React from 'react';

interface MealProps {
  title: string;
  category: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  warnings?: string[];
}

export default function MealCard({ title, category, calories, carbs, protein, fats, warnings }: MealProps) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{category}</span>
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
        </div>
        <span className="text-sm font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">{calories} kcal</span>
      </div>

      <div className="grid grid-cols-3 gap-2 my-3 text-center text-xs bg-slate-50 p-2 rounded-lg">
        <div><span className="block text-slate-400">Carbs</span><span className="font-semibold text-slate-700">{carbs}g</span></div>
        <div><span className="block text-slate-400">Protein</span><span className="font-semibold text-slate-700">{protein}g</span></div>
        <div><span className="block text-slate-400">Fats</span><span className="font-semibold text-slate-700">{fats}g</span></div>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="mt-3 pt-2 border-t border-amber-100">
          {warnings.map((warn, i) => (
            <p key={i} className="text-xs text-amber-600 font-medium flex items-center gap-1">
              ⚠️ {warn}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}