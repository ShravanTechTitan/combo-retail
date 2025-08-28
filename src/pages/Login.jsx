import { useState } from "react";
import Header from "../components/Header";
import { loginUser, registerUser } from "../api/authApi";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "",number:"" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = isLogin
        ? await loginUser(formData)
        : await registerUser(formData);

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email || formData.email);
        alert(`${isLogin ? "Login" : "Signup"} successful! 🎉`);
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm sm:text-base rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="Number"
                name="number"
                placeholder="Mobile Number"
                value={formData.number}
                onChange={handleChange}
                className="w-full px-4 py-3 mt-4 text-sm sm:text-base rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                required
              />
              </div>
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm sm:text-base rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm sm:text-base rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 sm:py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <p className="text-center mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-semibold ml-1"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
