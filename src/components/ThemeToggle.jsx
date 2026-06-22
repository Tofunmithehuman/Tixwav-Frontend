import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Light/dark theme toggle. Reflects the current `.dark` state on <html> — which
 *  may also change from the OS-preference listener in App — and persists an
 *  explicit choice only when the user clicks. */
const ThemeToggle = ({ className = "" }) => {
  const [dark, setDark] = useState(() => {
    try {
      return document.documentElement.classList.contains("dark");
    } catch {
      return false;
    }
  });

  // Keep the icon in sync when the theme changes elsewhere (OS preference,
  // another toggle instance) by watching the class on <html>.
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() =>
      setDark(el.classList.contains("dark")),
    );
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className={`w-9 h-9 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-600 hover:border-[#ff7f11] hover:text-[#ff7f11] transition-colors ${className}`}
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
};

export default ThemeToggle;
