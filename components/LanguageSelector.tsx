
import React from 'react';
import { Language } from '../types.ts';

interface LanguageSelectorProps {
  label: string;
  languages: Language[];
  selectedLanguage: string;
  onChange: (langCode: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  label, 
  languages, 
  selectedLanguage, 
  onChange, 
  disabled,
}) => {
  const uniqueId = label.replace(/\s+/g, '-').toLowerCase();

  // Dynamic style element for focus states and option styling using CSS variables
  const dynamicFocusStyles = `
    #${uniqueId}:focus {
      border-color: var(--input-focus-border-color) !important;
      box-shadow: 0 0 0 2px var(--input-focus-ring-color) !important;
      outline: none;
    }
    #${uniqueId} option {
      /* Attempt to use theme's input background */
      background-color: var(--input-background) !important; 
      /* Ensure option text is always black for visibility (using --option-item-text-color) */
      color: var(--option-item-text-color) !important; 
    }
    #${uniqueId} option:checked { /* Style for the selected item in the dropdown list */
      background-color: var(--brand-primary) !important;
      color: var(--brand-text-on-primary) !important; /* Text on brand primary, typically dark */
    }
     #${uniqueId} option:disabled {
      color: #9CA3AF; 
      background-color: #F3F4F6; 
    }
  `;

  return (
    <div className="flex flex-col space-y-1 w-full">
      <style>{dynamicFocusStyles}</style>
      <label htmlFor={uniqueId} className="text-sm font-medium" style={{color: 'var(--app-text-primary)'}}>{label}</label>
      <select
        id={uniqueId}
        value={selectedLanguage}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="block w-full p-3 rounded-md shadow-sm border focus:ring-2 focus:ring-opacity-75 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--input-background)', 
          color: 'var(--input-text)',               
          borderColor: 'var(--input-border-color)',   
          opacity: disabled ? 'var(--button-disabled-opacity)' : 1,
        }}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
