import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls back to the top whenever the route changes, so navigating to a new
 * page always starts at the top instead of keeping the previous scroll offset.
 */
export default function ScrollRestoration() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
