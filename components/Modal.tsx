
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="ai-modal"
      // Added 'modal-bg' for backdrop, and ensured animation classes are correctly applied for entrance.
      // The 'animate-modalShow' class is now defined globally in index.html
      className="fixed inset-0 modal-bg z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close if backdrop is clicked
      style={{ opacity: isOpen ? 1 : 0 }} // Control opacity for fade in/out via React state
    >
      <div
        id="ai-modal-content"
        // Initial state for animation: scale-95, opacity-0.
        // The 'animate-modalShow' class (defined in index.html) will drive it to scale(1) and opacity(1).
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <button
          id="modal-close-btn"
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-4xl font-light z-10"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-6 pt-8 sm:p-8">
          <h3 id="modal-title" className="text-2xl font-bold text-accent-1 mb-4 pr-8">
            {title}
          </h3>
          {/* Ensure child content uses prose for styling if it's HTML from Gemini */}
          <div id="modal-body" className="space-y-3 text-gray-700 prose max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;