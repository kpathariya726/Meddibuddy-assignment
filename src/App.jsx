import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { BookmarkProvider } from "./context/BookmarkContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SavedDrawer from "./components/SavedDrawer";
import CompareModal from "./components/CompareModal";
import QuickViewModal from "./components/QuickViewModal";
import HomePage from "./pages/HomePage";
import MedicineDetail from "./pages/MedicineDetail";

function App() {
  return (
    <ThemeProvider>
      <BookmarkProvider>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff", color: "#111" }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/medicine/:id" element={<MedicineDetail />} />
            </Routes>
          </main>
          <Footer />
          <SavedDrawer />
          <CompareModal />
          <QuickViewModal />
        </div>
      </BookmarkProvider>
    </ThemeProvider>
  );
}

export default App;
