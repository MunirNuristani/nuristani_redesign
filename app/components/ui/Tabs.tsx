"use client";
import React from 'react';

interface Tab {
  label: string;
  value: number;
}

interface TabsProps {
  tabs: Tab[];
  value: number;
  onChange: (value: number) => void;
  variant?: 'standard' | 'scrollable';
  className?: string;
}

export default function Tabs({ tabs, value, onChange, variant = 'standard', className = '' }: TabsProps) {
  return (
    <div
      className={`
        border-b border-gray-200
        ${variant === 'scrollable' ? 'overflow-x-auto' : ''}
        ${className}
      `}
    >
      <div className={`flex ${variant === 'scrollable' ? 'min-w-max' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              px-6 py-3 font-medium text-sm transition-all duration-200
              border-b-2 whitespace-nowrap
              ${
                value === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
