import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Build from "./pages/Build.jsx";
import Resume from "./pages/Resume.jsx";
import Analyze from "./pages/Analyze.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/build" element={<Build />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
