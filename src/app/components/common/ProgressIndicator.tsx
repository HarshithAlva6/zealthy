'use client'
import React from 'react';

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
  }
  
export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <React.Fragment key={i}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium 
            ${i + 1 <= currentStep ? 'bg-[#B75D48] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-1 mx-2 ${i + 1 < currentStep ? 'bg-[#9c4e3d]' : 'bg-gray-400'}`}/>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}