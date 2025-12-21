import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { authAPI, setTokens, clearTokens, getToken, getRefreshToken } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  role: "user" | "admin" | "editor" | "sales";
  phone_number?: string;
  location?: string;
  is_verified: boolean;
  two_factor_enabled: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  requires2FA: boolean;
  pendingEmail: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, totpCode?: string) => Promise<{ success: boolean; error?: string; requires2FA?: boolean }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  setup2FA: () => Promise<{ success: boolean; qrCode?: string; secret?: string; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  setPendingEmail: (email: string | null) => void;
}

interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUserResponse = (apiUser: any): User => ({
  id: apiUser.id,
  email: apiUser.email,
  first_name: apiUser.first_name,
  last_name: apiUser.last_name,
  name: `${apiUser.first_name} ${apiUser.last_name}`,
  role: apiUser.role,
  phone_number: apiUser.phone_number,
  location: apiUser.location,
  is_verified: apiUser.is_verified,
  two_factor_enabled: apiUser.two_factor_enabled,
  created_at: apiUser.created_at,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    requires2FA: false,
    pendingEmail: null,
  });

  const refreshUser = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      setState(s => ({ ...s, isLoading: false }));
      return;
    }

    const { data, error } = await authAPI.refresh(refreshToken);
    if (data?.user) {
      const user = mapUserResponse(data.user);
      setTokens(data.access_token, data.refresh_token);
      localStorage.setItem("gabrielsolar_user", JSON.stringify(user));
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        requires2FA: false,
        pendingEmail: null,
      });
    } else {
      clearTokens();
      setState({ user: null, isLoading: false, isAuthenticated: false, requires2FA: false, pendingEmail: null });
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("gabrielsolar_user");
    const token = getToken();

    if (savedUser && token) {
      try {
        const user = JSON.parse(savedUser);
        setState({ user, isLoading: false, isAuthenticated: true, requires2FA: false, pendingEmail: null });
      } catch {
        clearTokens();
        setState(s => ({ ...s, isLoading: false }));
      }
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string, totpCode?: string) => {
    const { data, error, status } = await authAPI.login(email, password, totpCode);

    if (error) {
      if (status === 403) {
        return { success: false, error: "Account not verified. Please check your email." };
      }
      return { success: false, error };
    }

    if (data?.requires_2fa) {
      setState(s => ({ ...s, requires2FA: true, pendingEmail: email }));
      return { success: false, requires2FA: true };
    }

    if (data?.user) {
      const user = mapUserResponse(data.user);
      setTokens(data.access_token, data.refresh_token);
      localStorage.setItem("gabrielsolar_user", JSON.stringify(user));
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        requires2FA: false,
        pendingEmail: null,
      });
      return { success: true };
    }

    return { success: false, error: "Login failed" };
  };

  const register = async (userData: RegisterData) => {
    const { data, error, status } = await authAPI.register(userData);

    if (error) {
      if (status === 400 && error.includes("nu este activat")) {
        return { success: false, error, requiresVerification: true };
      }
      return { success: false, error };
    }

    setState(s => ({ ...s, pendingEmail: userData.email }));
    return { success: true, requiresVerification: true };
  };

  const verifyCode = async (email: string, code: string) => {
    const { data, error } = await authAPI.verifyCode(email, code);
    if (error) return { success: false, error };
    return { success: true };
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authAPI.logout(refreshToken);
    }
    clearTokens();
    setState({ user: null, isLoading: false, isAuthenticated: false, requires2FA: false, pendingEmail: null });
  };

  const logoutAll = async () => {
    await authAPI.logoutAll();
    clearTokens();
    setState({ user: null, isLoading: false, isAuthenticated: false, requires2FA: false, pendingEmail: null });
  };

  const forgotPassword = async (email: string) => {
    const { error } = await authAPI.forgotPassword(email);
    if (error) return { success: false, error };
    return { success: true };
  };

  const resetPassword = async (token: string, newPassword: string) => {
    const { error } = await authAPI.resetPassword(token, newPassword);
    if (error) return { success: false, error };
    return { success: true };
  };

  const setup2FA = async () => {
    const { data, error } = await authAPI.setup2FA();
    if (error) return { success: false, error };
    return { success: true, qrCode: data?.qr_code, secret: data?.secret };
  };

  const verify2FA = async (code: string) => {
    const { error } = await authAPI.verify2FA(code);
    if (error) return { success: false, error };
    
    // Update user state to reflect 2FA enabled
    if (state.user) {
      const updatedUser = { ...state.user, two_factor_enabled: true };
      localStorage.setItem("gabrielsolar_user", JSON.stringify(updatedUser));
      setState(s => ({ ...s, user: updatedUser }));
    }
    
    return { success: true };
  };

  const setPendingEmail = (email: string | null) => {
    setState(s => ({ ...s, pendingEmail: email }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyCode,
        logout,
        logoutAll,
        forgotPassword,
        resetPassword,
        setup2FA,
        verify2FA,
        refreshUser,
        setPendingEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
