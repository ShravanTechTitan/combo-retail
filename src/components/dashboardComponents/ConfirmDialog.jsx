import React from "react";

export default function ConfirmDialog({ 
  isOpen, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item?", 
  onCancel, 
  onConfirm 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <h3 className="text-lg font-bold mb-3">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm text-white font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
