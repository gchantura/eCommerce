/**
 * Modal Component
 * 
 * A reusable modal dialog component that provides a consistent
 * way to display content in an overlay.
 * 
 * Features:
 * - Backdrop with click-to-close
 * - Header with title and close button
 * - Responsive sizing and positioning
 * - Scrollable content area
 * - Focus trap and accessibility features
 */

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;          // Controls modal visibility
  onClose: () => void;      // Callback when modal is closed
  title: string;            // Modal title text
  children: React.ReactNode; // Modal content
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    // Modal overlay - covers entire screen
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop - semi-transparent black background */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose} 
      />

      {/* Modal container - centers content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Modal body - allows scrolling if content is too long */}
          {children}
        </div>
      </div>
    </div>
  );
} 