import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";

export default function MedicineCard({ medicine, viewMode = "grid" }) {
  const { isBookmarked, toggleBookmark, toggleCompare, isInCompare, setPreviewMedicine } = useBookmarks();
  const [copied, setCopied] = useState(false);

  const openfda = medicine?.openfda || {};
  const id = openfda.spl_set_id?.[0];
  const brandName = openfda.brand_name?.[0] || "Unlabeled Medicine";
  const genericName = openfda.generic_name?.[0] || "Generic name not specified";
  const manufacturer = openfda.manufacturer_name?.[0] || "Unknown Manufacturer";
  const route = openfda.route?.[0];
  const productType = openfda.product_type?.[0] || "Drug Product";
  const ndc = openfda.product_ndc?.[0];
  const pharmClass = openfda.pharm_class_epc?.[0] || openfda.pharm_class_cs?.[0];

  const isOtc = productType.toLowerCase().includes("otc");
  const isRx = productType.toLowerCase().includes("prescription");
  const bookmarked = isBookmarked(id);
  const inCompare = isInCompare(id);

  const handleCopyId = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleBookmark = (e) => { e.preventDefault(); e.stopPropagation(); toggleBookmark(medicine); };
  const handleCompare = (e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(medicine); };
  const handleQuickView = (e) => { e.preventDefault(); e.stopPropagation(); setPreviewMedicine(medicine); };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: 14,
    background: "#fff",
    fontSize: 13
  };

  const tagStyle = {
    fontSize: 11, padding: "1px 6px", border: "1px solid #ccc",
    borderRadius: 2, background: "#f5f5f5", color: "#444", marginRight: 4
  };

  const actionBtn = (active) => ({
    fontSize: 12, padding: "3px 8px", cursor: "pointer", borderRadius: 3,
    border: "1px solid #bbb",
    background: active ? "#111" : "#fafafa",
    color: active ? "#fff" : "#333"
  });

  if (viewMode === "list") {
    return (
      <div style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
            {isOtc && <span style={tagStyle}>OTC</span>}
            {isRx && <span style={tagStyle}>Rx</span>}
            {route && <span style={tagStyle}>{route}</span>}
            {ndc && <span style={{ fontSize: 11, color: "#999", fontFamily: "monospace" }}>NDC: {ndc}</span>}
          </div>
          <Link to={`/medicine/${id}`} style={{ textDecoration: "none", color: "#111" }}>
            <strong style={{ fontSize: 14 }}>{brandName}</strong>
          </Link>
          <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{genericName}</div>
          <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>{manufacturer}</div>
          {pharmClass && <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{pharmClass}</div>}
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button onClick={handleQuickView} style={actionBtn(false)}>Preview</button>
          <button onClick={handleCompare} style={actionBtn(inCompare)}>{inCompare ? "Remove" : "Compare"}</button>
          <button onClick={handleBookmark} style={actionBtn(bookmarked)}>{bookmarked ? "Saved" : "Save"}</button>
          <Link to={`/medicine/${id}`} style={{ ...actionBtn(true), textDecoration: "none", display: "inline-block" }}>Label →</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...cardStyle, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {isOtc && <span style={tagStyle}>OTC</span>}
            {isRx && <span style={tagStyle}>Rx</span>}
            {route && <span style={tagStyle}>{route}</span>}
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={handleCompare} style={actionBtn(inCompare)} title={inCompare ? "Remove from Compare" : "Compare"}>⊞</button>
            <button onClick={handleBookmark} style={actionBtn(bookmarked)} title={bookmarked ? "Remove Bookmark" : "Save"}>{bookmarked ? "★" : "☆"}</button>
          </div>
        </div>

        <Link to={`/medicine/${id}`} style={{ textDecoration: "none", color: "#111" }}>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3, marginBottom: 4 }}>{brandName}</div>
        </Link>
        <div style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>{genericName}</div>

        <div style={{ fontSize: 12, color: "#888", borderTop: "1px solid #eee", paddingTop: 6, marginTop: 6 }}>
          {manufacturer}
        </div>
        {pharmClass && (
          <div style={{ fontSize: 11, color: "#555", marginTop: 4, fontStyle: "italic" }}>{pharmClass}</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 8, borderTop: "1px solid #eee" }}>
        <button onClick={handleCopyId} style={{ fontSize: 11, background: "none", border: "none", cursor: "pointer", color: "#888", padding: 0 }}>
          {copied ? "✓ Copied" : "Copy SPL ID"}
        </button>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={handleQuickView} style={actionBtn(false)}>Preview</button>
          <Link to={`/medicine/${id}`} style={{ ...actionBtn(true), textDecoration: "none" }}>Label →</Link>
        </div>
      </div>
    </div>
  );
}
