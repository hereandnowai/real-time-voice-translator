
import React, { useEffect } from 'react';
import IconButton from './IconButton.tsx';
import { XMarkIcon } from '../constants.tsx';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="bg-[var(--card-background)] text-[var(--card-text-primary)] rounded-xl shadow-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        style={{ boxShadow: 'var(--card-shadow)'}}
      >
        <div className="flex justify-between items-center pb-4 border-b mb-4" style={{ borderColor: 'var(--card-border-color)'}}>
          <h2 id="about-modal-title" className="text-2xl font-bold" style={{ color: 'var(--app-text-primary)'}}>✨ About This App</h2>
          <IconButton
            onClick={onClose}
            icon={<XMarkIcon className="w-6 h-6" />}
            label="Close modal"
            className="p-1 rounded-full hover:bg-[var(--button-secondary-hover-background)]"
            style={{ color: 'var(--icon-color)'}}
          />
        </div>

        <div className="space-y-4 text-sm sm:text-base" style={{ color: 'var(--card-text-secondary)'}}>
          <p>
            TravelTalk helps travelers break language barriers in real time — using voice translation powered by AI.
          </p>
          <p>
            Whether you're ordering food, asking for directions, or making new friends abroad, this app lets you:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>🗣️ Speak in your native language</li>
            <li>🌐 Translate instantly to the local language</li>
            <li>🔊 Play audio of the translated message</li>
            <li>🔁 Switch back and forth for two-way conversation</li>
          </ul>
          <p>
            Built with powerful Google AI and speech services, TravelTalk is your real-time interpreter — right in your pocket.
          </p>

          <div>
            <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: 'var(--app-text-primary)'}}>🎯 Key Use Cases</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Asking for directions</li>
              <li>Talking to taxi drivers or hotel staff</li>
              <li>Shopping in local markets</li>
              <li>Emergency situations where fast translation is critical</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mt-6 mb-2" style={{ color: 'var(--app-text-primary)'}}>🚀 How to Use</h3>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Choose your languages (e.g., English to French)</li>
              <li>Tap the mic and speak</li>
              <li>Read and listen to the translated message</li>
              <li>Let the other person respond and translate back!</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t text-right" style={{ borderColor: 'var(--card-border-color)'}}>
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                style={{ 
                    backgroundColor: 'var(--button-secondary-background)', 
                    color: 'var(--button-secondary-text)',
                    border: '1px solid var(--input-border-color)'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-hover-background)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--button-secondary-background)'}
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
