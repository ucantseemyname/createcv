import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ResumeProvider } from "./context/ResumeContext.jsx";
import "./index.css";

// After a new deploy, an old tab's lazy-chunk URLs (e.g. parseCv-*.js) no longer
// exist. Vite fires this when a dynamic import fails — reload once to fetch the
// fresh build. A session flag prevents an infinite reload loop.
window.addEventListener("vite:preloadError", () => {
  if (!sessionStorage.getItem("cc:chunkReloaded")) {
    sessionStorage.setItem("cc:chunkReloaded", "1");
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ResumeProvider>
        <App />
      </ResumeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
