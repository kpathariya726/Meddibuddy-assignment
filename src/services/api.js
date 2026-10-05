export async function searchMedicines(query, signal) {
  if (!query) return [];
  const res = await fetch(
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=20`,
    { signal },
  );
  if (res.status === 404) return [];
  if (!res.ok) throw new Error("API Error");
  const data = await res.json();
  return data.results || [];
}

export async function getMedicineDetails(id, signal) {
  const res = await fetch(
    `https://api.fda.gov/drug/label.json?search=openfda.spl_set_id:"${encodeURIComponent(id)}"&limit=1`,
    { signal },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("API Error");
  const data = await res.json();
  return data.results?.[0] || null;
}