"use client";
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardActions({ children, className = '' }: CardProps) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}

export default Card;
