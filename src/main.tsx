import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./style.css";
function ReadyApp() {
  useEffect(() => {
    window.dispatchEvent(new Event("panfolio:ready"));
  }, []);
  return <App />;
}
createRoot(document.getElementById("app")!, {
  onUncaughtError() {
    window.dispatchEvent(new Event("panfolio:failed"));
  },
}).render(<ReadyApp />);
