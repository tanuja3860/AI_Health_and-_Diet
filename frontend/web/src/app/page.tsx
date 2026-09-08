'use client';

import React, { useState } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { evaluateMealSafety } from '../services/api';
export default function OnboardingPage() {
  const [profile, setProfile] = useState({
    age: 30,
    weight_kg: 70,
    height_cm: 170,
    conditions: [] as string[],
  });

  const [mealInput, setMealInput] = useState({
    title: 'Custom Meal',
    carbs_g: 45,
    protein_g: 25,
    sodium_mg: 500,
    ingredients: [{ name: 'raw fish' }],
  });

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const availableConditions = [
    { id: 'pregnancy', label: 'Pregnancy' },
    { id: 'diabetes', label: 'Type 2 Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'kidney_disease', label: 'Kidney Disease' },
    { id: 'celiac', label: 'Celiac Disease' },
  ];

  const toggleCondition = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(id)
        ? prev.conditions.filter((c) => c !== id)
        : [...prev.conditions, id],
    }));
  };

  const handleSafetyCheck = async () => {
    setLoading(true);
    try {
      const data = await evaluateMealSafety({
        ...mealInput,
        user_conditions: profile.conditions,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      {/* Header Bar */}
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-6 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-emerald-700">Clinical AI Health Dashboard</h1>
          <p className="text-sm text-slate-500">Multi-Condition Dietary Safety Matrix</p>
        </div>
        <LanguageSwitcher />
      </header>

      <main className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Step 1: Health Profile Onboarding */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">1. Health Profile Setup</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Active Health Conditions</label>
              <div className="flex flex-wrap gap-2">
                {availableConditions.map((cond) => {
                  const active = profile.conditions.includes(cond.id);
                  return (
                    <button
                      key={cond.id}
                      onClick={() => toggleCondition(cond.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        active
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cond.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500">Age</label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.weight_kg}
                  onChange={(e) => setProfile({ ...profile, weight_kg: Number(e.target.value) })}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Height (cm)</label>
                <input
                  type="number"
                  value={profile.height_cm}
                  onChange={(e) => setProfile({ ...profile, height_cm: Number(e.target.value) })}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Meal Test & Safety Engine Output */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">2. Evaluate Meal Safety</h2>

          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-xs text-slate-500">Meal Name</label>
              <input
                type="text"
                value={mealInput.title}
                onChange={(e) => setMealInput({ ...mealInput, title: e.target.value })}
                className="w-full mt-1 border rounded-md p-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-slate-500">Carbs (g)</label>
                <input
                  type="number"
                  value={mealInput.carbs_g}
                  onChange={(e) => setMealInput({ ...mealInput, carbs_g: Number(e.target.value) })}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Protein (g)</label>
                <input
                  type="number"
                  value={mealInput.protein_g}
                  onChange={(e) => setMealInput({ ...mealInput, protein_g: Number(e.target.value) })}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500">Sodium (mg)</label>
                <input
                  type="number"
                  value={mealInput.sodium_mg}
                  onChange={(e) => setMealInput({ ...mealInput, sodium_mg: Number(e.target.value) })}
                  className="w-full mt-1 border rounded-md p-2 text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSafetyCheck}
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition"
            >
              {loading ? 'Evaluating Matrix...' : 'Check Multi-Condition Safety'}
            </button>
          </div>

          {/* Engine Output */}
          {result && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}