"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "../types/user";
import toast from "react-hot-toast";
import axios from "axios";

// Configure axios for Django CSRF
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";

// Add Django session handling interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      const authContext = useContext(AuthContext);
      if (authContext) {
        authContext.logout();
      }
    }
    return Promise.reject(error);
  }
);

// Add token refresh to the context interface
interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    redirectTo?: string
  ) => Promise<void>;
  register: (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    confirm_password: string;
    user_role: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<{ success: boolean }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean }>;
  resetPassword: (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<{ success: boolean }>;
  signInWithGoogle: () => Promise<void>;
  handleGoogleCallback: (
    code: string,
    state: string
  ) => Promise<{ success: boolean }>;
  clearError: () => void;
  checkAuth: () => Promise<{ user: User | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearError = useCallback(() => setError(null), []);

  const checkAuth = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("API URL is not defined");
      setIsLoading(false);
      return { user: null, isAuthenticated: false };
    }

    try {
      // First, check if we have a token in localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setUser(null);
        return { user: null, isAuthenticated: false };
      }

      const user = JSON.parse(userStr);
      const token = user?.entity?.token;
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return { user: null, isAuthenticated: false };
      }

      setUser(user);
      setIsLoading(false);
      return { user, isAuthenticated: true };
    } catch (error) {
      console.error("Error checking auth status:", error);
      setUser(null);
      setIsLoading(false);
      return { user: null, isAuthenticated: false };
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      try {
        setIsLoading(true);
        console.log("Initiating login for:", email);

        const body = JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        });

        console.log("Login body:", body);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "allow-credentials": "true",
          },
          body,
          credentials: "include",
        });

        if (!response.ok) {
          console.error("Login failed:", "Unknown error");
          throw new Error("Login failed");
        }

        console.log("Login Response:", response);

        console.log("Login response status:", response.status);

        const data = await response.json().catch((error) => {
          console.error("Failed to parse login response:", error);
          throw new Error("Invalid response from server");
        });

        console.log("Login successful, user data:", data);

        // Update auth state
        setUser(data.user || data);
        setError(null);

        // Store user data in localStorage
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        } else if (data) {
          localStorage.setItem("user", JSON.stringify(data));
        }

        // Redirect to the requested page or home page
        router.push(redirectTo || "/cart");

        return data;
      } catch (error: any) {
        console.error("Login error:", error);
        const errorMessage =
          error.response?.data?.detail || error.message || "Login failed";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (userData: {
      first_name: string;
      last_name: string;
      email: string;
      phone_number: string;
      password: string;
      confirm_password: string;
      user_role: number;
    }) => {
      console.log("Registering user with data:", userData);
      try {
        setIsLoading(true);

        // Call our Next.js API route
        const payload = {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          phone_number: userData.phone_number,
          password: userData.password,
          confirm_password: userData.confirm_password,
          user_role: userData.user_role,
        };

        console.log("Sending registration payload:", payload);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Registration response:", data);
        console.log("Registration response:", response);

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        // If registration is successful, verify the session
        await checkAuth();

        toast.success("Registration successful!");
        router.push("/");
        setIsLoading(false);
        return data;
      } catch (error: any) {
        setIsLoading(false);
        console.error("Registration error:", error);
        toast.error(error.message || "Registration failed");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_API_URL}auth/logout/`,
      //   {
      //     method: "POST",
      //     credentials: "include",
      //   }
      // );
      const user = localStorage.getItem("user");
      if (!user) {
        setUser(null);
        return;
      }

      localStorage.removeItem("user");

      setUser(null);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Logout failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Email verification
  const verifyEmail = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      console.log("Initiating email verification for:", email);

      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });

      const data = await response.json().catch((error) => {
        console.error("Failed to parse verification response:", error);
        return { error: "Invalid response from server" };
      });

      console.log("Email verification response:", {
        status: response.status,
        data,
      });

      if (!response.ok) {
        const errorMessage =
          data.error || data.detail || "Email verification failed";
        console.error("Verification failed:", errorMessage);
        throw new Error(errorMessage);
      }

      // Clear the pending verification email from local storage
      localStorage.removeItem("pendingVerificationEmail");

      toast.success("Email verified successfully!");
      return { success: true };
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast.error(
        error.message || "An error occurred during email verification"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset
  const requestPasswordReset = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      toast.success(
        "If an account with this email exists, a reset link has been sent"
      );
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/forgot-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: data.token,
          new_password: data.newPassword,
          confirm_password: data.confirmPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Password reset failed");
      }

      toast.success("Password has been reset successfully!");
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Password reset failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      // This will redirect to Google's OAuth page
      window.location.href = "/api/auth/google";
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate Google sign in");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (code: string, state: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, state }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google sign in failed");
      }

      // Update user state
      // await checkAuth();
      toast.success("Signed in with Google successfully!");
      router.push("/cart");
      return { success: true };
    } catch (error: any) {
      toast.error(error.message || "Google sign in failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        // Auth methods
        login,
        register,
        logout,
        // Email verification
        verifyEmail,
        // Password reset
        requestPasswordReset,
        resetPassword,
        // Google OAuth
        signInWithGoogle,
        handleGoogleCallback,
        // Utils
        clearError,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
