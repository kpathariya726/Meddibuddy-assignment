import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getMedicineDetails } from "../services/api";
import { useBookmarks } from "../context/BookmarkContext";

const TABS = [
  { id: "indications", label: "Indications & Purpose" },
  { id: "dosage", label: "Dosage & Admin" },
  { id: "ingredients", label: "Active Ingredients" },
  { id: "warnings", label: "Safety & Warnings" },
  { id: "regulatory", label: "FDA Regulatory Info" },
];

export default function MedicineDetail() {
  const { id } = useParams();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("indications");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [sectionSearch, setSectionSearch] = useState("");

  const { isBookmarked, toggleBookmark, toggleCompare, isInCompare } = useBookmarks();

  useEffect(() => {
    window.scrollTo(0, 0);
    const abortController = new AbortController();
    async function fetchDetail() {
      setLoading(true); setError(null);
      try {
        const data = await getMedicineDetails(id, abortController.signal);
        if (!data) setError("Medicine monograph not found for this FDA identifier.");
        else setMedicine(data);
      } catch (err) {
        if (err.name !== "AbortError") setError("Failed to fetch medicine details. Please check your connection.");
      } finally { setLoading(false); }
    }
    fetchDetail();
    return () => abortController.abort();
  }, [id]);

  const handleShare = () => { navigator.clipboard.writeText(window.location.href); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); };
  const handleCopySplId = (splId) => { navigator.clipboard.writeText(splId); setCopiedId(true); setTimeout(() => setCopiedId(false), 2000); };
  const handlePrint = () => window.print();

  const btnStyle = {
    fontSize: 12, padding: "4px 10px", cursor: "pointer", borderRadius: 3,
    border: "1px solid #bbb", background: "#f5f5f5", color: "#333"
  };
  const activeBtnStyle = { ...btnStyle, background: "#111", color: "#fff", border: "1px solid #111" };

  if (loading) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ color: "#999", fontSize: 14 }}>Loading monograph...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 16px", textAlign: "center" }}>
        <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Monograph Not Available</p>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>{error}</p>
        <Link to="/" style={{ fontSize: 13, color: "#111", textDecoration: "underline" }}>← Back to Search</Link>
      </div>
    );
  }

  if (!medicine) return null;

  const openfda = medicine.openfda || {};
  const brandName = openfda.brand_name?.[0] || "Unlabeled Pharmaceutical";
  const genericName = openfda.generic_name?.[0] || "Generic name not specified";
  const manufacturer = openfda.manufacturer_name?.[0] || "Unknown Manufacturer";
  const route = openfda.route?.[0] || "N/A";
  const productType = openfda.product_type?.[0] || "Drug Product";
  const splSetId = openfda.spl_set_id?.[0] || id;
  const productNdc = openfda.product_ndc?.[0] || "N/A";
  const pharmClassEpc = openfda.pharm_class_epc || [];
  const pharmClassMoa = openfda.pharm_class_moa || [];
  const bookmarked = isBookmarked(splSetId);
  const inCompare = isInCompare(splSetId);
  const isOtc = productType.toLowerCase().includes("otc");
  const isRx = productType.toLowerCase().includes("prescription");
  const hasBoxedWarning = Boolean(medicine.boxed_warning?.[0]);
  const hasGeneralWarnings = Boolean(medicine.warnings?.[0]);

  const renderSection = (title, content) => {
    if (!content) return null;
    const text = Array.isArray(content) ? content.join("\n\n") : content;
    if (!text || text.trim() === "") return null;
    if (sectionSearch.trim() && !text.toLowerCase().includes(sectionSearch.toLowerCase()) && !title.toLowerCase().includes(sectionSearch.toLowerCase())) return null;
    return (
      <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: 16, marginBottom: 12, background: "#fafafa" }}>
        <strong style={{ fontSize: 13, display: "block", marginBottom: 8 }}>{title}</strong>
        <div style={{ fontSize: 13, color: "#333", whiteSpace: "pre-line", lineHeight: 1.6 }}>{text}</div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      {/* Breadcrumb & actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <div style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6, color: "#666" }}>
          <Link to="/" style={{ color: "#111", textDecoration: "none", fontSize: 13 }}>← Search</Link>
          <span>/</span>
          <span style={{ color: "#333" }}>{brandName}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => toggleCompare(medicine)} style={inCompare ? activeBtnStyle : btnStyle}>
            {inCompare ? "In Compare" : "Compare"}
          </button>
          <button onClick={() => toggleBookmark(medicine)} style={bookmarked ? activeBtnStyle : btnStyle}>
            {bookmarked ? "Saved" : "Save"}
          </button>
          <button onClick={handleShare} style={btnStyle}>{copiedLink ? "Copied!" : "Share"}</button>
          <button onClick={handlePrint} style={btnStyle}>Print</button>
        </div>
      </div>

      {/* Header */}
      <div style={{ borderBottom: "2px solid #111", paddingBottom: 16, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {isOtc && <span style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #bbb", borderRadius: 2, background: "#f5f5f5" }}>OTC</span>}
          {isRx && <span style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #bbb", borderRadius: 2, background: "#f5f5f5" }}>Rx Only</span>}
          {route && <span style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #bbb", borderRadius: 2, background: "#f5f5f5" }}>Route: {route}</span>}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px", color: "#111" }}>{brandName}</h1>
        <p style={{ fontSize: 15, color: "#555", margin: "0 0 12px" }}>{genericName}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, fontSize: 12, color: "#666" }}>
          <span>Manufacturer: <strong style={{ color: "#111" }}>{manufacturer}</strong></span>
          <span>NDC: <strong style={{ color: "#111", fontFamily: "monospace" }}>{productNdc}</strong></span>
          <button onClick={() => handleCopySplId(splSetId)}
            style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#555", textDecoration: "underline", padding: 0 }}>
            {copiedId ? "Copied SPL ID" : `SPL: ${splSetId}`}
          </button>
        </div>
      </div>

      {/* Warning banner */}
      {(hasBoxedWarning || hasGeneralWarnings) && (
        <div style={{ border: "1px solid #bbb", padding: "10px 14px", marginBottom: 16, background: "#fafafa", fontSize: 13 }}>
          <strong>⚠ FDA Safety Notice:</strong> This monograph contains critical warnings. Review the Safety & Warnings tab before use.
        </div>
      )}

      {/* Tabs + search */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid #ddd" }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id
              ? { fontSize: 13, padding: "4px 12px", cursor: "pointer", borderRadius: 3, border: "1px solid #111", background: "#111", color: "#fff", fontWeight: 600 }
              : { fontSize: 13, padding: "4px 12px", cursor: "pointer", borderRadius: 3, border: "1px solid #bbb", background: "#fafafa", color: "#333" }
            }>
            {tab.label}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="text"
            value={sectionSearch}
            onChange={(e) => setSectionSearch(e.target.value)}
            placeholder="Filter text..."
            style={{ fontSize: 12, padding: "4px 8px", border: "1px solid #bbb", borderRadius: 3, outline: "none", width: 140 }}
          />
          {sectionSearch && (
            <button onClick={() => setSectionSearch("")} style={{ fontSize: 12, background: "none", border: "none", cursor: "pointer", color: "#888" }}>✕</button>
          )}
        </div>
      </div>

      {/* Content grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
        <div>
          {activeTab === "indications" && (<>
            {renderSection("Clinical Purpose", medicine.purpose)}
            {renderSection("Indications & Clinical Usage", medicine.indications_and_usage)}
            {renderSection("When Using This Product", medicine.when_using)}
            {renderSection("Principal Display Panel", medicine.package_label_principal_display_panel)}
          </>)}
          {activeTab === "dosage" && (<>
            {renderSection("Dosage & Administration", medicine.dosage_and_administration)}
            {renderSection("Dosage Administration Table", medicine.dosage_and_administration_table)}
            {renderSection("Storage & Handling", medicine.storage_and_handling)}
            {renderSection("Stop Use", medicine.stop_use)}
          </>)}
          {activeTab === "ingredients" && (<>
            {renderSection("Active Ingredients & Strength", medicine.active_ingredient)}
            {renderSection("Inactive Ingredients", medicine.inactive_ingredient)}
            {renderSection("SPL Product Data Elements", medicine.spl_product_data_elements)}
          </>)}
          {activeTab === "warnings" && (<>
            {renderSection("Boxed Warning (Black Box)", medicine.boxed_warning)}
            {renderSection("Clinical Warnings", medicine.warnings)}
            {renderSection("Do Not Use (Contraindications)", medicine.do_not_use)}
            {renderSection("Ask Doctor Before Use", medicine.ask_doctor)}
            {renderSection("Drug Interactions", medicine.ask_doctor_or_pharmacist)}
            {renderSection("Pregnancy / Breast-Feeding", medicine.pregnancy_or_breast_feeding)}
            {renderSection("Keep Out of Reach of Children", medicine.keep_out_of_reach_of_children)}
            {renderSection("Adverse Reactions", medicine.adverse_reactions)}
            {renderSection("Overdosage", medicine.overdosage)}
          </>)}
          {activeTab === "regulatory" && (
            <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: 16, background: "#fafafa" }}>
              <strong style={{ fontSize: 13, display: "block", marginBottom: 12 }}>OpenFDA Regulatory Identifiers</strong>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <tbody>
                  {[
                    ["Application Number", openfda.application_number?.[0] || "N/A"],
                    ["Product NDC", openfda.product_ndc?.[0] || "N/A"],
                    ["SPL Set ID", splSetId],
                    ["Effective Time", medicine.effective_time || "Latest FDA Filing"],
                  ].map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "6px 8px", color: "#666", width: "40%" }}>{k}</td>
                      <td style={{ padding: "6px 8px", fontFamily: "monospace", color: "#111" }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pharmClassEpc.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <strong style={{ fontSize: 12, display: "block", marginBottom: 6 }}>Pharmacologic Class (EPC)</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {pharmClassEpc.map((cls, i) => (
                      <span key={i} style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #ccc", borderRadius: 2, background: "#f5f5f5" }}>{cls}</span>
                    ))}
                  </div>
                </div>
              )}
              {pharmClassMoa.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <strong style={{ fontSize: 12, display: "block", marginBottom: 6 }}>Mechanism of Action (MOA)</strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {pharmClassMoa.map((cls, i) => (
                      <span key={i} style={{ fontSize: 11, padding: "2px 6px", border: "1px solid #ccc", borderRadius: 2, background: "#f5f5f5" }}>{cls}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: 14, position: "sticky", top: 64, fontSize: 12 }}>
            <strong style={{ fontSize: 13, display: "block", marginBottom: 10 }}>Clinical Factsheet</strong>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {[
                  ["Type", productType],
                  ["Route", route],
                  ["Packaging", openfda.is_original_packager?.[0] ? "Original" : "Repackaged"],
                  ["SPL Version", `v${medicine.version || "1"}`],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "5px 0", color: "#777", paddingRight: 8 }}>{k}</td>
                    <td style={{ padding: "5px 0", fontWeight: 600, color: "#111" }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 12, padding: 10, border: "1px solid #ddd", borderRadius: 3, background: "#fafafa", fontSize: 11, color: "#555", lineHeight: 1.5 }}>
              <strong>Note:</strong> Always verify dosage against individual patient parameters, age, kidney/liver function, and existing drug regimens.
            </div>

            <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
              <a href={`https://dailymed.nlm.nih.gov/dailymed/search.cfm?labeltype=all&query=${encodeURIComponent(brandName)}`}
                target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: "#111", textDecoration: "underline" }}>
                View on DailyMed (NIH) →
              </a>
              <a href={`https://api.fda.gov/drug/label.json?search=openfda.spl_set_id:"${encodeURIComponent(splSetId)}"`}
                target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: "#555", textDecoration: "underline", fontFamily: "monospace" }}>
                Raw OpenFDA JSON →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
