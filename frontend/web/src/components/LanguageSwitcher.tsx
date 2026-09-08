'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <select
        onChange={changeLanguage}
        value={i18n.language || 'en'}
        className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <option value="en">English 🇺🇸</option>
        <option value="es">Español 🇪🇸</option>
        <option value="hi">हिंदी 🇮🇳</option>
      </select>
    </div>
  );
}