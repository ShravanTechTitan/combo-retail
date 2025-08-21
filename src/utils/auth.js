// src/utils/auth.js
export function isLoggedIn() {
  return !!localStorage.getItem("token"); // true if token exists
}
