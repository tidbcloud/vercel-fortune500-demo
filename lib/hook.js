import { useEffect } from "react";

export function useFullScreen() {
  useEffect(() => {
    function setHeight() {
      const el = document.querySelector(".main");
      if (el) {
        el.style.minHeight = window.innerHeight + "px";
      }
    }
    const deviceWidth = window.matchMedia("(max-width: 700px)");
    if (deviceWidth.matches) {
      window.addEventListener("resize", setHeight);
      setHeight();
    }
  }, []);
}
