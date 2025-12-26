"use client";
import React from 'react';
import { X } from 'lucide-react';

interface AlertProps {
  severity?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Alert({ severity = 'info', onClose, children, className = '' }: AlertProps) {
  const severityClasses = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const iconColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  return (
    <div
      className={`
        ${severityClasses[severity]}
        border rounded-lg p-4 flex items-start justify-between
        ${className}
      `}
      role="alert"
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className={`ml-4 ${iconColors[severity]} hover:opacity-70 transition-opacity`}
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
