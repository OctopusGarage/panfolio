import { useEffect } from "react";
/** Standalone-only gesture policy; browser tabs retain their native zoom controls. */
export function usePwaGestures(installed: boolean) {
  useEffect(() => {
    const standalone =
      matchMedia("(display-mode: standalone)").matches ||
      !!(navigator as Navigator & { standalone?: boolean }).standalone;
    if (!installed || !standalone) return;
    const root = document.documentElement;
    root.dataset.standalone = "true";
    const viewport = document.querySelector<HTMLMetaElement>(
      "meta[name=viewport]",
    );
    const original = viewport?.content;
    if (viewport)
      viewport.content =
        "width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1,user-scalable=no";
    const pinch = (event: TouchEvent) => {
      if (event.touches.length > 1 && event.cancelable) event.preventDefault();
    };
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey && event.cancelable) event.preventDefault();
    };
    document.addEventListener("wheel", wheel, { passive: false });
    const gesture = (event: Event) => {
      if (event.cancelable) event.preventDefault();
    };
    document.addEventListener("touchmove", pinch, { passive: false });
    document.addEventListener("gesturestart", gesture, { passive: false });
    document.addEventListener("gesturechange", gesture, { passive: false });
    return () => {
      delete root.dataset.standalone;
      if (viewport && original) viewport.content = original;
      document.removeEventListener("touchmove", pinch);
      document.removeEventListener("wheel", wheel);
      document.removeEventListener("gesturestart", gesture);
      document.removeEventListener("gesturechange", gesture);
    };
  }, [installed]);
}
