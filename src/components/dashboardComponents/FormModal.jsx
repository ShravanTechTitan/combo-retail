// components/FormModal.jsx
import React from "react";

export default function FormModal({ title, children, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-lg w-1/2 p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form
          onSubmit={onSubmit}
          className="max-h-[70vh] overflow-y-auto pr-2"
        >
          {children}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
