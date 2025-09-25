export default function Footer() {
    return (
      <footer className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-gray-900 dark:to-gray-800 text-white py-8 px-6 mt-10">
       
        {/* Bottom Line */}
        <div className="border-t border-green-500 mt-6 pt-4 text-center text-sm text-gray-200">
          © {new Date().getFullYear()} Universal Combo. All rights reserved.
        </div>
      </footer>
    );
  }
  