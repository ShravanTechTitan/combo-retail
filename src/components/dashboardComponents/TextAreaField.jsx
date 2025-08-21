export default function TextAreaField({ label, name, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm 
                   focus:ring-2 focus:ring-green-500 text-white"
      />
    </div>
  );
}
