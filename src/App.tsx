import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { AppProvider } from "./context/AppContext";

function App() {
  return (
    <AppProvider>
      <Suspense fallback={
        <div className="min-h-screen bg-[#0a0e14] flex items-center justify-center">
          <span className="text-[#00d9ff] font-mono text-sm animate-pulse">Initializing...</span>
        </div>
      }>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </>
      </Suspense>
    </AppProvider>
  );
}

export default App;
