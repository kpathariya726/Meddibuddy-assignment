import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearch } from "../hooks/useSearch";
import MedicineCard from "../components/MedicineCard";

const POPULAR_SEARCHES = [
  "Advil", "Amoxicillin", "Metformin", "Ozempic", "Lisinopril",
  "Atorvastatin", "Ibuprofen", "Tylenol", "Albuterol", "Omeprazole",
];

const FILTER_OPTIONS = [
  { id: "all", label: "All" },
  { id: "rx", label: "Rx Only" },
  { id: "otc", label: "OTC" },
  { id: "oral", label: "Oral" },
  { id: "topical", label: "Topical" },
  { id: "injectable", label: "Injectable" },
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("meddi_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const searchInputRef = useRef(null);
  const { results, loading, error } = useSearch(query);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length > 2 && results.length > 0) {
      if (recentSearches[0]?.toLowerCase() === cleanQuery.toLowerCase()) return;
      const filtered = recentSearches.filter(
        (item) => item.toLowerCase() !== cleanQuery.toLowerCase()
      );
      const updated = [cleanQuery, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      try { localStorage.setItem("meddi_recent_searches", JSON.stringify(updated)); } catch {}
    }
  }, [results, query, recentSearches]);

  const handleSelectQuery = (term) => {
    setQuery(term);
    searchInputRef.current?.focus();
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("meddi_recent_searches");
  };

  const filteredResults = useMemo(() => {
    if (!results || results.length === 0) return [];
    let list = [...results];
    if (activeFilter !== "all") {
      list = list.filter((item) => {
        const openfda = item.openfda || {};
        const productType = (openfda.product_type?.[0] || "").toLowerCase();
        const route = (openfda.route?.[0] || "").toLowerCase();
        if (activeFilter === "rx") return productType.includes("prescription");
        if (activeFilter === "otc") return productType.includes("otc");
        if (activeFilter === "oral") return route.includes("oral");
        if (activeFilter === "topical") return route.includes("topical");
        if (activeFilter === "injectable") return route.includes("injection") || route.includes("intravenous") || route.includes("subcutaneous");
        return true;
      });
    }
    if (sortBy === "name-asc") {
      list.sort((a, b) => (a.openfda?.brand_name?.[0] || "").localeCompare(b.openfda?.brand_name?.[0] || ""));
    } else if (sortBy === "manufacturer-asc") {
      list.sort((a, b) => (a.openfda?.manufacturer_name?.[0] || "").localeCompare(b.openfda?.manufacturer_name?.[0] || ""));
    }
    return list;
  }, [results, activeFilter, sortBy]);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, color: "#111" }}>
          FDA Drug Label Search
        </h1>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
          Search official FDA monographs, indications, dosage, ingredients, and warnings.
        </p>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand name (e.g. Advil, Ozempic)..."
            autoFocus
            style={{
              flex: 1, padding: "8px 12px", fontSize: 14,
              border: "1px solid #bbb", borderRadius: 4, outline: "none", color: "#111"
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ padding: "8px 10px", border: "1px solid #bbb", background: "#f5f5f5", borderRadius: 4, cursor: "pointer", fontSize: 13 }}
            >
              ✕
            </button>
          )}
          {loading && <span style={{ fontSize: 12, color: "#999" }}>Loading...</span>}
        </div>

        {/* Popular */}
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#888" }}>Popular:</span>
          {POPULAR_SEARCHES.map((term) => (
            <button key={term} onClick={() => handleSelectQuery(term)}
              style={{ fontSize: 12, padding: "2px 8px", border: "1px solid #ccc", background: "#fafafa", borderRadius: 3, cursor: "pointer", color: "#333" }}>
              {term}
            </button>
          ))}
        </div>

        {/* Recent */}
        {recentSearches.length > 0 && !query && (
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#888" }}>Recent:</span>
            {recentSearches.map((term) => (
              <button key={term} onClick={() => handleSelectQuery(term)}
                style={{ fontSize: 12, padding: "2px 8px", border: "1px solid #ddd", background: "#f5f5f5", borderRadius: 3, cursor: "pointer", color: "#444" }}>
                {term}
              </button>
            ))}
            <button onClick={handleClearHistory}
              style={{ fontSize: 11, color: "#999", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Controls (only when results) */}
      {query && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #eee" }}>
          <span style={{ fontSize: 13, color: "#333" }}>
            {loading ? "Searching..." : `${filteredResults.length} result${filteredResults.length !== 1 ? "s" : ""} for "${query}"${activeFilter !== "all" ? ` (filtered from ${results.length})` : ""}`}
          </span>
          <div style={{ display: "flex", gap: 4, marginLeft: "auto" }}>
            {FILTER_OPTIONS.map((f) => (
              <button key={f.id} onClick={() => setActiveFilter(f.id)}
                style={{
                  fontSize: 12, padding: "3px 8px", cursor: "pointer", borderRadius: 3,
                  border: "1px solid #bbb",
                  background: activeFilter === f.id ? "#111" : "#fafafa",
                  color: activeFilter === f.id ? "#fff" : "#333"
                }}>
                {f.label}
              </button>
            ))}
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            style={{ fontSize: 12, padding: "3px 6px", border: "1px solid #bbb", borderRadius: 3, color: "#333" }}>
            <option value="relevance">Relevance</option>
            <option value="name-asc">Brand (A–Z)</option>
            <option value="manufacturer-asc">Manufacturer (A–Z)</option>
          </select>
          <div style={{ display: "flex", gap: 2 }}>
            <button onClick={() => setViewMode("grid")}
              style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #bbb", borderRadius: 3, cursor: "pointer", background: viewMode === "grid" ? "#111" : "#fafafa", color: viewMode === "grid" ? "#fff" : "#333" }}>
              Grid
            </button>
            <button onClick={() => setViewMode("list")}
              style={{ fontSize: 12, padding: "3px 8px", border: "1px solid #bbb", borderRadius: 3, cursor: "pointer", background: viewMode === "list" ? "#111" : "#fafafa", color: viewMode === "list" ? "#fff" : "#333" }}>
              List
            </button>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ border: "1px solid #eee", borderRadius: 4, padding: 16, height: 140, background: "#fafafa" }} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 4, background: "#fafafa", marginTop: 16 }}>
          <strong style={{ fontSize: 14 }}>Error</strong>
          <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
            {error === "API Error" ? "The OpenFDA service encountered an issue. Please retry." : error}
          </p>
          <button onClick={() => handleSelectQuery(query)}
            style={{ marginTop: 8, fontSize: 12, padding: "4px 10px", border: "1px solid #bbb", background: "#f5f5f5", borderRadius: 3, cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {/* No results */}
      {!loading && !error && query && filteredResults.length === 0 && (
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No results for "{query}"</p>
          <p style={{ fontSize: 12, color: "#777", marginBottom: 12 }}>Try a brand name or generic ingredient (e.g. "Advil", "Metformin").</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
            {POPULAR_SEARCHES.slice(0, 4).map((term) => (
              <button key={term} onClick={() => handleSelectQuery(term)}
                style={{ fontSize: 12, padding: "3px 10px", border: "1px solid #bbb", background: "#fafafa", borderRadius: 3, cursor: "pointer" }}>
                Try "{term}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && !error && filteredResults.length > 0 && (
        <div style={viewMode === "grid"
          ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }
          : { display: "flex", flexDirection: "column", gap: 8 }
        }>
          {filteredResults.map((medicine, idx) => {
            const id = medicine.openfda?.spl_set_id?.[0] || idx;
            return <MedicineCard key={id} medicine={medicine} viewMode={viewMode} />;
          })}
        </div>
      )}

      {/* Landing info when no search */}
      {!query && (
        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
            Powered by the openFDA Drug Labels API. Data retrieved live from FDA SPL database.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Amoxicillin", "Metformin", "Ozempic", "Advil", "Lisinopril", "Ibuprofen"].map((med) => (
              <button key={med} onClick={() => handleSelectQuery(med)}
                style={{ fontSize: 12, padding: "4px 10px", border: "1px solid #bbb", background: "#fafafa", borderRadius: 3, cursor: "pointer", color: "#333" }}>
                Search {med} →
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
