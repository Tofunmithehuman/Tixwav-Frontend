import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const getInitial = () => {
  try {
    return document.documentElement.classList.contains("dark");
  } catch {
    return false;
  }
};

/** Light/dark theme toggle. Persists the choice and toggles `.dark` on <html>. */
const ThemeToggle = ({ className = "" }) => {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors ${className}`}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};

export default ThemeToggle;
