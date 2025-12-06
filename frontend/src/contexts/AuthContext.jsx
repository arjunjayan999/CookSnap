import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    let mounted = true;
    async function applyToken() {
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const raw = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            const json = decodeURIComponent(
              atob(raw)
                .split("")
                .map(function (c) {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );
            const payload = JSON.parse(json);
            const email = payload.email || payload.sub || null;
            const name = payload.name || payload.username || null;
            const photo = payload.photo || null;
            if (mounted) {
              setUser({
                ...(email ? { email } : {}),
                ...(name ? { name } : {}),
                ...(photo ? { photo } : {}),
              });
              return;
            }
          }
        } catch (e) {}

        try {
          const res = await api.get("/api/auth/me");
          if (mounted && res && res.data) {
            setUser(res.data);
            return;
          }
        } catch (e) {}
      } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        if (mounted) setUser(null);
      }
    }

    applyToken();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      setUser(res.data.user || { email });
      return res.data;
    }
    throw new Error("Login failed");
  };

  const signup = async (email, password, name) => {
    const res = await api.post("/api/auth/signup", { email, password, name });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    try {
      localStorage.removeItem("pantry");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, signup, logout, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
