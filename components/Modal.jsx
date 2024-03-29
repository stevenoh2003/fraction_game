import React from 'react'

const Modal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <p>{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white p-2 rounded"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal