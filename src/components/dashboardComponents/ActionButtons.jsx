// components/ActionButtons.jsx
export default function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md"
      >
        Delete
      </button>
    </div>
  );
}
