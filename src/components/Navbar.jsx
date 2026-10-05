import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";

export default function Navbar() {
  const { bookmarks, setIsDrawerOpen, compareList, setIsCompareOpen } = useBookmarks();
  const location = useLocation();

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      background: "#fff", borderBottom: "1px solid #ddd",
      padding: "0 1rem"
    }}>
      <div style={{
        maxWidth: 960, margin: "0 auto",
        height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 700, fontSize: 16 }}>
            MeddiSearch
          </Link>
          <span style={{ fontSize: 11, color: "#888" }}>FDA Drug Label Explorer</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {compareList.length > 0 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              style={btnStyle}
            >
              Compare ({compareList.length})
            </button>
          )}

          <button
            onClick={() => setIsDrawerOpen(true)}
            style={btnStyle}
          >
            Saved {bookmarks.length > 0 ? `(${bookmarks.length})` : ""}
          </button>

          <a
            href="https://open.fda.gov/apis/drug/label/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: "#555", textDecoration: "none" }}
          >
            FDA Docs ↗
          </a>
        </div>
      </div>
    </header>
  );
}

const btnStyle = {
  fontSize: 12,
  padding: "4px 10px",
  border: "1px solid #bbb",
  background: "#f5f5f5",
  cursor: "pointer",
  borderRadius: 4,
  color: "#111"
};
