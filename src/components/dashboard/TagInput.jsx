'use client';

import React, { useState } from 'react';

/**
 * TagInput
 * A reusable "chip" input for entering multiple short values (colors, sizes, tags, etc.)
 *
 * Props:
 * - label:       string, optional label rendered above the field
 * - values:      string[], the current list of tags
 * - onChange:    (newValues: string[]) => void, called whenever tags are added/removed
 * - placeholder: string, shown in the text input when empty
 */
export default function TagInput({ label, values = [], onChange, placeholder = 'Add item...' }) {
  const [inputValue, setInputValue] = useState('');

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    if (values.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue('');
      return;
    }
    onChange([...values, trimmed]);
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onChange(values.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && values.length > 0) {
      // quick-remove the last tag when backspacing on an empty input
      removeTag(values[values.length - 1]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-[10px] font-heading font-bold uppercase tracking-wider text-zinc-400 mb-2">
          {label}
        </label>
      )}

      <div className="w-full px-3 py-2.5 bg-white border border-zinc-200 focus-within:border-dark rounded-xl flex flex-wrap gap-1.5 items-center transition-colors">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 bg-zinc-100 text-dark text-[11px] font-semibold px-2.5 py-1.5 rounded-lg"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-zinc-400 hover:text-red-500 cursor-pointer leading-none transition-colors"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={values.length === 0 ? placeholder : 'Add another...'}
          className="flex-1 min-w-[90px] bg-transparent text-xs font-body outline-none py-1"
        />

        <button
          type="button"
          onClick={addTag}
          disabled={!inputValue.trim()}
          className="px-3 py-1.5 bg-dark hover:bg-[#C9FA75] text-white hover:text-dark text-[10px] font-heading font-bold uppercase tracking-wider rounded-lg transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-dark disabled:hover:text-white flex-shrink-0"
        >
          + Add
        </button>
      </div>
    </div>
  );
}