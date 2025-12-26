import { useEffect } from "react";

export default function NoCopyProvider({ children }) {
  // Use useEffect with proper error handling for React 19
  useEffect(() => {
    try {
      // Disable right click
      const handleContextMenu = (e) => e.preventDefault();
      // Disable text selection
      const handleSelectStart = (e) => e.preventDefault();
      // Disable copy shortcut
      const handleCopy = (e) => e.preventDefault();
      // Optional: block PrintScreen (deterrent only)
      const handleKeyDown = (e) => {
        if (e.key === "PrintScreen") {
          alert("⚠️ Screenshots are restricted on this page!");
          if (navigator.clipboard) {
            navigator.clipboard.writeText("").catch(() => {}); // clears clipboard on Windows
          }
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("selectstart", handleSelectStart);
      document.addEventListener("copy", handleCopy);
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("selectstart", handleSelectStart);
        document.removeEventListener("copy", handleCopy);
        window.removeEventListener("keydown", handleKeyDown);
      };
    } catch (error) {
      console.error("NoCopyProvider error:", error);
    }
  }, []);

  return <>{children}</>;
}
