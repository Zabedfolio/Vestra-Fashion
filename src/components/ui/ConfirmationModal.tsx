'use client';

import React from 'react';
import { CircleExclamation } from '@gravity-ui/icons';

export default function ConfirmationModal({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'OK', 
  cancelText = 'Cancel', 
  isDangerous = true 
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 flex items-center justify-center animate-fade-in"
      onClick={onCancel}
    >
      <div 
        className="bg-white border border-zinc-150 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl relative animate-scale-up text-dark font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-zinc-400 hover:text-dark text-lg cursor-pointer transition-colors"
        >
          ✕
        </button>
        
        {/* Warning Icon */}
        <div className={`w-12 h-12 ${isDangerous ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-amber-50 text-amber-500 border border-amber-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <CircleExclamation className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="font-heading font-black text-sm uppercase tracking-wider text-dark mb-2">
          {title || 'Confirm Action'}
        </h3>

        {/* Description Message */}
        <p className="font-body text-zinc-500 text-xs leading-relaxed mb-6">
          {message || 'Are you sure you want to proceed?'}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-650 hover:text-dark rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 text-white rounded-xl text-[10px] font-heading font-bold uppercase tracking-wider transition cursor-pointer ${
              isDangerous 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-dark hover:bg-[#C9FA75] hover:text-dark'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
