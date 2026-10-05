import React, { createContext, useContext, useState, useEffect } from "react";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("meddi_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [previewMedicine, setPreviewMedicine] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem("meddi_bookmarks", JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Failed to save bookmarks", e);
    }
  }, [bookmarks]);

  const isBookmarked = (id) => {
    if (!id) return false;
    return bookmarks.some((b) => b.id === id);
  };

  const toggleBookmark = (medicine) => {
    if (!medicine) return;
    const openfda = medicine.openfda || {};
    const id = openfda.spl_set_id?.[0] || medicine.id || medicine.set_id;
    if (!id) return;

    if (isBookmarked(id)) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
    } else {
      const brandName =
        openfda.brand_name?.[0] || medicine.brandName || "Unknown Brand";
      const genericName =
        openfda.generic_name?.[0] || medicine.genericName || "N/A";
      const manufacturer =
        openfda.manufacturer_name?.[0] || medicine.manufacturer || "N/A";
      const productType =
        openfda.product_type?.[0] || medicine.productType || "N/A";
      const route = openfda.route?.[0] || medicine.route || "N/A";
      const purpose = medicine.purpose?.[0] || medicine.purpose || "";

      const newBookmark = {
        id,
        brandName,
        genericName,
        manufacturer,
        productType,
        route,
        purpose,
        raw: medicine,
        savedAt: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);
    }
  };

  const removeBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const clearBookmarks = () => {
    setBookmarks([]);
  };

  const toggleCompare = (med) => {
    const id = med.openfda?.spl_set_id?.[0] || med.id;
    if (!id) return;

    setCompareList((prev) => {
      const exists = prev.some(
        (item) => (item.openfda?.spl_set_id?.[0] || item.id) === id,
      );
      if (exists) {
        return prev.filter(
          (item) => (item.openfda?.spl_set_id?.[0] || item.id) !== id,
        );
      } else {
        if (prev.length >= 2) {
          return [prev[1], med];
        }
        return [...prev, med];
      }
    });
  };

  const isInCompare = (id) => {
    return compareList.some(
      (item) => (item.openfda?.spl_set_id?.[0] || item.id) === id,
    );
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isBookmarked,
        toggleBookmark,
        removeBookmark,
        clearBookmarks,
        isDrawerOpen,
        setIsDrawerOpen,
        compareList,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        previewMedicine,
        setPreviewMedicine,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context)
    throw new Error("useBookmarks must be used within BookmarkProvider");
  return context;
}
