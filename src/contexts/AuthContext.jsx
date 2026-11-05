import { useCallback, useEffect, useMemo, useState } from "react";
import AuthContext from "./authContextValue";
import { apiRequest } from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restaura a sessao a partir do cookie httpOnly ao abrir o site.
  useEffect(() => {
    let active = true;
    apiRequest("/auth/me")
      .then((data) => {
        if (active) setUser(data?.user ?? null);
      })
      .catch(() => {
        // Backend fora do ar ou sem sessao: segue como visitante.
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data.user;
  }, []);

  const updateProfile = useCallback(async (profile) => {
    const data = await apiRequest("/users/me", {
      method: "PATCH",
      body: JSON.stringify(profile),
    });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    // O cookie e httpOnly, so o servidor pode apagar.
    apiRequest("/auth/logout", { method: "POST" }).catch(() => {});
  }, []);

  /** Recarrega o usuario (saldo de creditos, plano) depois de uma compra. */
  const refreshUser = useCallback(async () => {
    const data = await apiRequest("/auth/me");
    setUser(data?.user ?? null);
    return data?.user ?? null;
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    register,
    login,
    updateProfile,
    refreshUser,
    logout,
  }), [user, loading, register, login, updateProfile, refreshUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
