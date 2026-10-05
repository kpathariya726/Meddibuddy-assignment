import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";

export default function QuickViewModal() {
  const { previewMedicine, setPreviewMedicine, isBookmarked, toggleBookmark } =
    useBookmarks();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPreviewMedicine(null);
    };
    if (previewMedicine) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewMedicine, setPreviewMedicine]);

  if (!previewMedicine) return null;

  const openfda = previewMedicine.openfda || {};
  const id = openfda.spl_set_id?.[0];
  const brandName = openfda.brand_name?.[0] || "Drug Monograph";
  const genericName = openfda.generic_name?.[0] || "N/A";
  const manufacturer = openfda.manufacturer_name?.[0] || "N/A";
  const productType = openfda.product_type?.[0] || "Drug Product";
  const route = openfda.route?.[0] || "N/A";
  const activeIng = previewMedicine.active_ingredient?.[0];
  const purpose = previewMedicine.purpose?.[0];
  const indications = previewMedicine.indications_and_usage?.[0];
  const warnings =
    previewMedicine.warnings?.[0] || previewMedicine.boxed_warning?.[0];
  const bookmarked = isBookmarked(id);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: 16,
      }}
      onClick={() => setPreviewMedicine(null)}
    >
      <div
        style={{
          backgroundColor: "#fff",
          color: "#000",
          width: "100%",
          maxWidth: 600,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span style={{ fontSize: 11, color: "#666" }}>
              {productType} | {route}
            </span>
            <h2 style={{ margin: "2px 0 0 0", fontSize: 18 }}>{brandName}</h2>
            <div style={{ fontSize: 12, color: "#666" }}>{genericName}</div>
          </div>
          <div>
            <button
              onClick={() => toggleBookmark(previewMedicine)}
              style={{ marginRight: 8, padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
            >
              {bookmarked ? "Saved" : "Save"}
            </button>
            <button
              onClick={() => setPreviewMedicine(null)}
              style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16, fontSize: 13 }}>
          <div style={{ background: "#f9f9f9", border: "1px solid #eee", padding: 10, marginBottom: 12 }}>
            <p style={{ margin: "2px 0" }}><strong>Manufacturer:</strong> {manufacturer}</p>
            <p style={{ margin: "2px 0" }}><strong>Route:</strong> {route}</p>
            <p style={{ margin: "2px 0" }}><strong>SPL ID:</strong> {id || "N/A"}</p>
          </div>

          {activeIng && (
            <div style={{ marginBottom: 12 }}>
              <strong>Active Ingredient:</strong>
              <p style={{ marginTop: 4, color: "#333", whiteSpace: "pre-line" }}>{activeIng}</p>
            </div>
          )}

          {(purpose || indications) && (
            <div style={{ marginBottom: 12 }}>
              <strong>Indications & Purpose:</strong>
              <p style={{ marginTop: 4, color: "#333", whiteSpace: "pre-line" }}>{purpose || indications}</p>
            </div>
          )}

          {warnings && (
            <div style={{ marginBottom: 12 }}>
              <strong>Warnings:</strong>
              <p style={{ marginTop: 4, color: "#333", whiteSpace: "pre-line" }}>{warnings}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #ccc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => setPreviewMedicine(null)}
            style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
          >
            Close
          </button>
          <Link
            to={`/medicine/${id}`}
            onClick={() => setPreviewMedicine(null)}
            style={{ fontSize: 12, color: "#00f", textDecoration: "none" }}
          >
            Full FDA Monograph &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
