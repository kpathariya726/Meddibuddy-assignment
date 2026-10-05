import React from "react";
import { Link } from "react-router-dom";
import { useBookmarks } from "../context/BookmarkContext";

export default function CompareModal() {
  const {
    compareList,
    clearCompare,
    toggleCompare,
    isCompareOpen,
    setIsCompareOpen,
  } = useBookmarks();

  if (!isCompareOpen) return null;

  const drugA = compareList[0];
  const drugB = compareList[1];

  const extractInfo = (med) => {
    if (!med) return null;
    const openfda = med.openfda || {};
    return {
      id: openfda.spl_set_id?.[0] || med.id,
      brand: openfda.brand_name?.[0] || med.brandName || "Unknown",
      generic: openfda.generic_name?.[0] || med.genericName || "N/A",
      manufacturer: openfda.manufacturer_name?.[0] || med.manufacturer || "N/A",
      productType: openfda.product_type?.[0] || med.productType || "N/A",
      route: openfda.route?.[0] || med.route || "N/A",
      active: med.active_ingredient?.[0] || "Refer to package label",
      purpose: med.purpose?.[0] || med.purpose || "Refer to indications section",
      warnings:
        med.warnings?.[0] ||
        med.boxed_warning?.[0] ||
        "See full monograph for precautions",
    };
  };

  const infoA = extractInfo(drugA);
  const infoB = extractInfo(drugB);

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
      onClick={() => setIsCompareOpen(false)}
    >
      <div
        style={{
          backgroundColor: "#fff",
          color: "#000",
          width: "100%",
          maxWidth: 800,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: "bold" }}>
              Drug Comparison
            </h3>
            <span style={{ fontSize: 12, color: "#666" }}>
              Side-by-side comparison
            </span>
          </div>
          <div>
            {compareList.length > 0 && (
              <button
                onClick={clearCompare}
                style={{
                  marginRight: 8,
                  padding: "4px 8px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              style={{ padding: "4px 8px", fontSize: 12, cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {compareList.length === 0 ? (
            <div style={{ textCenter: "center", padding: 32, color: "#666" }}>
              No drugs selected for comparison.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Drug A */}
              <div style={{ border: "1px solid #ddd", padding: 12 }}>
                {infoA ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <strong>{infoA.brand}</strong>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {infoA.generic}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(drugA)}
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        Remove
                      </button>
                    </div>
                    <div style={{ fontSize: 12, marginTop: 12 }}>
                      <p><strong>Type:</strong> {infoA.productType}</p>
                      <p><strong>Manufacturer:</strong> {infoA.manufacturer}</p>
                      <p><strong>Route:</strong> {infoA.route}</p>
                      <p><strong>Active Ingredient:</strong> {infoA.active}</p>
                      <p><strong>Indications:</strong> {infoA.purpose}</p>
                      <p><strong>Warnings:</strong> {infoA.warnings}</p>
                    </div>
                    <Link
                      to={`/medicine/${infoA.id}`}
                      onClick={() => setIsCompareOpen(false)}
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        fontSize: 12,
                        color: "#00f",
                      }}
                    >
                      View Monograph &rarr;
                    </Link>
                  </>
                ) : (
                  <div style={{ color: "#888", fontSize: 12 }}>Slot A Empty</div>
                )}
              </div>

              {/* Drug B */}
              <div style={{ border: "1px solid #ddd", padding: 12 }}>
                {infoB ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <strong>{infoB.brand}</strong>
                        <div style={{ fontSize: 12, color: "#666" }}>
                          {infoB.generic}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleCompare(drugB)}
                        style={{ cursor: "pointer", fontSize: 12 }}
                      >
                        Remove
                      </button>
                    </div>
                    <div style={{ fontSize: 12, marginTop: 12 }}>
                      <p><strong>Type:</strong> {infoB.productType}</p>
                      <p><strong>Manufacturer:</strong> {infoB.manufacturer}</p>
                      <p><strong>Route:</strong> {infoB.route}</p>
                      <p><strong>Active Ingredient:</strong> {infoB.active}</p>
                      <p><strong>Indications:</strong> {infoB.purpose}</p>
                      <p><strong>Warnings:</strong> {infoB.warnings}</p>
                    </div>
                    <Link
                      to={`/medicine/${infoB.id}`}
                      onClick={() => setIsCompareOpen(false)}
                      style={{
                        display: "inline-block",
                        marginTop: 12,
                        fontSize: 12,
                        color: "#00f",
                      }}
                    >
                      View Monograph &rarr;
                    </Link>
                  </>
                ) : (
                  <div style={{ color: "#888", fontSize: 12 }}>
                    Select a 2nd drug to compare
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
