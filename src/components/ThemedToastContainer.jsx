import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

/**
 * ToastContainer whose theme follows the app's light/dark mode live. Watches the
 * `dark` class on <html> so toasts switch theme the moment the user toggles.
 */
const ThemedToastContainer = () => {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const sync = () =>
      setDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={3500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={dark ? "dark" : "light"}
      toastStyle={{
        borderRadius: "12px",
        fontFamily: "inherit",
        fontSize: "14px",
      }}
    />
  );
};

export default ThemedToastContainer;
