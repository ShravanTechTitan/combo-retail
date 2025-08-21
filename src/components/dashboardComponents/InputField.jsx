export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium dark:text-gray-300">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white text-sm"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white text-sm"
        />
      )}
    </div>
  );
}
