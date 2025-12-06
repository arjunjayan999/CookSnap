import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const PantryContext = createContext();

export function usePantry() {
  return useContext(PantryContext);
}

function loadLocal() {
  try {
    return JSON.parse(localStorage.getItem("pantry") || "[]");
  } catch (e) {
    return [];
  }
}

function saveLocal(items) {
  localStorage.setItem("pantry", JSON.stringify(items));
}

export function PantryProvider({ children }) {
  const { user } = useAuth() || {};
  const [items, setItems] = useState(loadLocal());
  const [loading, setLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function sync() {
      if (!user) {
        setItems(loadLocal());
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/api/pantry");
        const server = Array.isArray(res.data) ? res.data : [];

        const local = loadLocal();
        const serverNames = new Set(
          server.map((s) => (s.name || "").toLowerCase())
        );
        for (const li of local) {
          if (!li.name) continue;
          if (!serverNames.has((li.name || "").toLowerCase())) {
            try {
              const created = await api.post("/api/pantry", {
                name: li.name,
                quantity: li.quantity || 1,
                unit: li.unit || "",
                meta: li.meta || {},
              });
              server.push(created.data);
            } catch (err) {
              console.warn("Failed to create server pantry item", err);
            }
          }
        }

        if (mounted) {
          setItems(server);
          saveLocal(server);
        }
      } catch (err) {
        console.warn("Failed to sync pantry with server", err);
        if (mounted) setItems(loadLocal());
      } finally {
        if (mounted) setLoading(false);
      }
    }
    sync();
    return () => {
      mounted = false;
    };
  }, [user]);

  const addItem = async (payload) => {
    if (user) {
      const res = await api.post("/api/pantry", payload);
      const created = res.data;
      setItems((prev) => {
        const next = [created, ...prev];
        saveLocal(next);
        return next;
      });
      return created;
    }
    setItems((prev) => {
      const next = [payload, ...prev];
      saveLocal(next);
      return next;
    });
    return payload;
  };

  function _keyFor(it) {
    return it._id || (it.name ? `name:${it.name}` : null);
  }

  const toggleSelect = (it) => {
    const key = _keyFor(it);
    if (!key) return;
    setSelectedKeys((prev) => {
      const s = new Set(prev);
      if (s.has(key)) s.delete(key);
      else s.add(key);
      return Array.from(s);
    });
  };

  const isSelected = (it) => {
    const key = _keyFor(it);
    if (!key) return false;
    return selectedKeys.includes(key);
  };

  const selectedItems = () => {
    const set = new Set(selectedKeys);
    return items.filter((it) => {
      const k = _keyFor(it);
      return k && set.has(k);
    });
  };

  const clearSelection = () => setSelectedKeys([]);

  const updateItem = async (idOrIndex, updates) => {
    const it = items.find((i) => i._id === idOrIndex) || items[idOrIndex];
    if (!it) return null;
    if (it._id && user) {
      const res = await api.put(`/api/pantry/${it._id}`, updates);
      const updated = res.data;
      const next = items.map((i) => (i._id === it._id ? updated : i));
      setItems(next);
      saveLocal(next);
      return updated;
    }
    const next = items.map((i) => (i === it ? { ...i, ...updates } : i));
    setItems(next);
    saveLocal(next);
    return next.find((i) => i === it);
  };

  const deleteItem = async (idOrIndex) => {
    const it = items.find((i) => i._id === idOrIndex) || items[idOrIndex];
    if (!it) return;
    if (it._id && user) {
      await api.delete(`/api/pantry/${it._id}`);
      const next = items.filter((i) => i._id !== it._id);
      setItems(next);
      saveLocal(next);
      return;
    }
    const next = items.filter((i) => i !== it);
    setItems(next);
    saveLocal(next);
  };

  const clearAll = async () => {
    if (user) {
      await api.delete("/api/pantry");
    }
    setItems([]);
    saveLocal([]);
  };

  const exportCSV = () => {
    const header = ["name", "quantity", "unit", "meta"];
    const rows = [header.join(",")];
    for (const it of items) {
      const row = [
        `"${(it.name || "").replace(/"/g, '""')}"`,
        it.quantity || "",
        `"${(it.unit || "").replace(/"/g, '""')}"`,
        `"${JSON.stringify(it.meta || {}).replace(/"/g, '""')}"`,
      ];
      rows.push(row.join(","));
    }
    const csv = rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pantry.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    clearAll,
    exportCSV,
    selectedKeys,
    toggleSelect,
    isSelected,
    selectedItems,
    clearSelection,
  };

  return (
    <PantryContext.Provider value={value}>{children}</PantryContext.Provider>
  );
}

export default PantryProvider;
