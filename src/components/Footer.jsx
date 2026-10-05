import React from "react";

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #ddd", padding: "20px 16px", fontSize: 12, color: "#888", marginTop: 40 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
        <div>
          <strong style={{ color: "#111", fontSize: 13 }}>MeddiSearch</strong>
          <span style={{ marginLeft: 8, color: "#aaa" }}>Powered by openFDA Drug Labels API</span>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://open.fda.gov/apis/drug/label/" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "underline" }}>openFDA API</a>
          <a href="https://dailymed.nlm.nih.gov/dailymed/" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "underline" }}>DailyMed</a>
          <a href="https://www.accessdata.fda.gov/scripts/cder/daf/" target="_blank" rel="noreferrer" style={{ color: "#888", textDecoration: "underline" }}>Drugs@FDA</a>
        </div>
        <div style={{ color: "#bbb" }}>© {CURRENT_YEAR} MeddiSearch • Not medical advice</div>
      </div>
    </footer>
  );
}
