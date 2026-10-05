import React from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";

export default function SavedDrawer() {
  const {
    bookmarks, removeBookmark, clearBookmarks,
    isDrawerOpen, setIsDrawerOpen,
    toggleCompare, isInCompare, setIsCompareOpen,
  } = useBookmarks();

  if (!isDrawerOpen) return null;

  const btnStyle = {
    fontSize: 12, padding: "3px 8px", cursor: "pointer", borderRadius: 3,
    border: "1px solid #bbb", background: "#f5f5f5", color: "#333"
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }}
        onClick={() => setIsDrawerOpen(false)}
      />
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 360,
        background: "#fff", borderLeft: "1px solid #ddd",
        display: "flex", flexDirection: "column", zIndex: 51
      }}>
        {/* Header */}
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong style={{ fontSize: 14 }}>Saved Medications</strong>
            <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""}</span>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} style={{ ...btnStyle, fontSize: 14, padding: "2px 8px" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {bookmarks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
              <p style={{ fontSize: 14, marginBottom: 6 }}>No saved medications</p>
              <p style={{ fontSize: 12 }}>Click Save on any medicine card to add it here.</p>
            </div>
          ) : (
            bookmarks.map((item) => {
              const inComp = isInCompare(item.id);
              return (
                <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: 4, padding: 12, marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link to={`/medicine/${item.id}`} onClick={() => setIsDrawerOpen(false)}
                        style={{ fontWeight: 600, fontSize: 13, color: "#111", textDecoration: "none" }}>
                        {item.brandName}
                      </Link>
                      <div style={{ fontSize: 11, color: "#777", marginTop: 2 }}>{item.genericName}</div>
                    </div>
                    <button onClick={() => removeBookmark(item.id)}
                      style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#999", padding: "0 4px" }}>✕</button>
                  </div>
                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#aaa" }}>{item.manufacturer}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => toggleCompare(item.raw || item)}
                        style={{ ...btnStyle, background: inComp ? "#111" : "#f5f5f5", color: inComp ? "#fff" : "#333", border: inComp ? "1px solid #111" : "1px solid #bbb" }}>
                        {inComp ? "Comparing" : "Compare"}
                      </button>
                      <Link to={`/medicine/${item.id}`} onClick={() => setIsDrawerOpen(false)}
                        style={{ ...btnStyle, textDecoration: "none", display: "inline-block" }}>
                        View →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div style={{ padding: "10px 16px", borderTop: "1px solid #ddd", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={clearBookmarks} style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#999", textDecoration: "underline" }}>
              Clear all
            </button>
            <button onClick={() => { setIsDrawerOpen(false); setIsCompareOpen(true); }}
              style={{ fontSize: 12, padding: "4px 12px", cursor: "pointer", border: "1px solid #111", background: "#111", color: "#fff", borderRadius: 3 }}>
              Open Comparison
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
