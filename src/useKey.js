import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(
    function () {
      const closeOnEscsape = (e) => {
        if (e.key.toLowerCase() === key.toLowerCase()) {
          action();
        }
      };
      document.addEventListener("keydown", closeOnEscsape);
      return () => document.removeEventListener("keydown", closeOnEscsape);
    },
    [key, action]
  );
}
