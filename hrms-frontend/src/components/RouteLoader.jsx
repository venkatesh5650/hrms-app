import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalLoader } from "../context/GlobalLoaderContext";

export default function RouteLoader() {
  const location = useLocation();
  const { showLoader, hideLoader } = useGlobalLoader();
  const timerRef = useRef(null);

  useEffect(() => {
    showLoader();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      hideLoader();
    }, 600);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [location.pathname, showLoader, hideLoader]);

  return null;
}
