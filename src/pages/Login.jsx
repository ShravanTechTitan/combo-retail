import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Header from "../components/Header";
import { loginUser, registerUser, sendOtp, verifyOtp, resetPassword } from "../api/authApi";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "", number: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ message: "", show: false });

  const [forgotPasswordStep, setForgotPasswordStep] = useState(false);
  const [otpData, setOtpData] = useState({ email: "", otp: "", newPassword: "" });

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setOtpData({ ...otpData, [e.target.name]: e.target.value });
  };

  const showToast = (msg) => {
    setToast({ message: msg, show: true });
    setTimeout(() => setToast({ message: "", show: false }), 3000);
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
        localStorage.setItem("id", data.id);
        localStorage.setItem("role", data.role);
        showToast(`${isLogin ? "Login" : "Signup"} successful! 🎉`);

        // ✅ redirect based on role
        setTimeout(() => {
          const role = data.role || localStorage.getItem("role");
          if (role === "admin" || role === "superadmin") {
            // If trying to access dashboard or already on dashboard route, go to dashboard
            if (from.includes("/dashboard") || from === "/") {
              navigate("/dashboard", { replace: true });
            } else {
              navigate(from, { replace: true });
            }
          } else {
            navigate(from, { replace: true });
          }
        }, 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!otpData.email) return showToast("Enter your email!");
    try {
      setLoading(true);
      await sendOtp({ email: otpData.email });
      showToast("OTP sent! Check your email/SMS.");
      setForgotPasswordStep(true);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otpData.otp || !otpData.newPassword) return showToast("Fill all fields!");
    try {
      setLoading(true);
      const { token } = await verifyOtp({ email: otpData.email, otp: otpData.otp });
      await resetPassword({ token, newPassword: otpData.newPassword });
      showToast("Password reset successful! 🎉");
      setForgotPasswordStep(false);
      setOtpData({ email: "", otp: "", newPassword: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" required />
                <input type="number" name="number" placeholder="Mobile Number" value={formData.number} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" required />
              </>
            )}

            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500" required />

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>

          <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-300">
            <span>
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-semibold">{isLogin ? "Sign Up" : "Login"}</button>
            </span>
            {isLogin && (
              <button
  onClick={() => setForgotPasswordStep(!forgotPasswordStep)}
  className="text-blue-600 hover:underline"
>
  Forgot password?
</button>

            )}
          </div>

          {/* Inline Forgot Password / OTP */}
          {isLogin && forgotPasswordStep && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg space-y-3">
              {!otpData.otp ? (
                <>
                  <input type="email" name="email" placeholder="Enter your email" value={otpData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-600 dark:text-white" />
                  <button onClick={handleSendOtp} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Send OTP</button>
                </>
              ) : (
                <>
                  <input type="text" name="otp" placeholder="Enter OTP" value={otpData.otp} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-600 dark:text-white" />
                  <input type="password" name="newPassword" placeholder="New Password" value={otpData.newPassword} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border dark:bg-gray-600 dark:text-white" />
                  <button onClick={handleResetPassword} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Reset Password</button>
                </>
              )}
            </div>
          )}

          {toast.show && (
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up z-50">
              {toast.message}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          0% { transform: translateY(50px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
