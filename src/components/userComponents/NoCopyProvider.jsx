import { useEffect } from "react";

export default function NoCopyProvider({ children }) {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => e.preventDefault();
    // Disable text selection
    const handleSelectStart = (e) => e.preventDefault();
    // Disable copy shortcut
    const handleCopy = (e) => e.preventDefault();
    // Optional: block PrintScreen (deterrent only)
    const handleKeyDown = (e) => {
        const handleKeyDown = (e) => {
            if (e.key === "PrintScreen") {
              alert("⚠️ Screenshots are restricted on this page!");
              navigator.clipboard.writeText(""); // clears clipboard on Windows
            }
          };
        
          window.addEventListener("keydown", handleKeyDown);
          return () => window.removeEventListener("keydown", handleKeyDown);
        
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
  }, []);

  return <div>{children}</div>;
}
