// components/DarkWrapper.jsx
export default function DarkWrapper({ children, title }) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-lg bg-gray-800 shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );
}
