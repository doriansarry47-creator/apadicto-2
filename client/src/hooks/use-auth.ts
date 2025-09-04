import { useState, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useAuthQuery() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include", // Ensure cookies are sent for session
        });
        
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            return null; // User not authenticated
          }
          
          // Clone response to prevent 'body stream already read' error
          const responseClone = response.clone();
          let errorMessage = "Failed to fetch user";
          
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // If JSON parsing fails, try to get text
            try {
              const errorText = await responseClone.text();
              errorMessage = errorText || errorMessage;
            } catch {
              // Keep default error message
            }
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data.user;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error("Network error - please check your connection");
        }
        throw error;
      }
    },
    retry: (failureCount, error) => {
      // Don't retry on auth errors or network errors
      if (error?.message?.includes('Network error') || 
          error?.message?.includes('Failed to fetch user')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// PATCHED LOGIN MUTATION
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for session cookies
          body: JSON.stringify({ email, password }),
        });

        // Clone response to prevent 'body stream already read' error
        const responseClone = response.clone();
        let data: any;
        let errorMessage: string;

        try {
          data = await response.json();
          errorMessage = data?.message || "Login failed";
        } catch {
          // If JSON parsing fails, try to get text from clone
          try {
            const text = await responseClone.text();
            errorMessage = text || "Login failed - invalid response format";
          } catch {
            errorMessage = "Login failed - server error";
          }
        }

        if (!response.ok) {
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error("Network error - please check your connection");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Update auth query cache with user data
      if (data?.user) {
        queryClient.setQueryData(["auth", "me"], data.user);
      }
      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      // Clear auth data on login error
      queryClient.setQueryData(["auth", "me"], null);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      role?: string;
    }) => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for session cookies
          body: JSON.stringify(userData),
        });

        // Clone response to prevent 'body stream already read' error
        const responseClone = response.clone();
        let data: any;
        let errorMessage: string;

        try {
          data = await response.json();
          errorMessage = data?.message || "Registration failed";
        } catch {
          // If JSON parsing fails, try to get text from clone
          try {
            const text = await responseClone.text();
            errorMessage = text || "Registration failed - invalid response format";
          } catch {
            errorMessage = "Registration failed - server error";
          }
        }

        if (!response.ok) {
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error("Network error - please check your connection");
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      // Update auth query cache with user data
      if (data?.user) {
        queryClient.setQueryData(["auth", "me"], data.user);
      }
      // Invalidate and refetch auth queries
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      // Clear auth data on registration error
      queryClient.setQueryData(["auth", "me"], null);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include", // Important for session cookies
        });

        // Clone response to prevent 'body stream already read' error
        const responseClone = response.clone();
        let data: any;
        let errorMessage: string;

        try {
          data = await response.json();
          errorMessage = data?.message || "Logout failed";
        } catch {
          // If JSON parsing fails, try to get text from clone
          try {
            const text = await responseClone.text();
            errorMessage = text || "Logout failed - invalid response format";
          } catch {
            errorMessage = "Logout failed - server error";
          }
        }

        if (!response.ok) {
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error("Network error - please check your connection");
        }
        throw error;
      }
    },
    onSuccess: () => {
      // Clear all auth-related data
      queryClient.setQueryData(["auth", "me"], null);
      // Clear all cached data to ensure fresh state after logout
      queryClient.clear();
    },
    onError: () => {
      // Even if logout fails, clear local auth state
      queryClient.setQueryData(["auth", "me"], null);
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email }),
        });

        // Clone response to prevent 'body stream already read' error
        const responseClone = response.clone();
        let data: any;
        let errorMessage: string;

        try {
          data = await response.json();
          errorMessage = data?.message || "Password reset failed";
        } catch {
          // If JSON parsing fails, try to get text from clone
          try {
            const text = await responseClone.text();
            errorMessage = text || "Password reset failed - invalid response format";
          } catch {
            errorMessage = "Password reset failed - server error";
          }
        }

        if (!response.ok) {
          throw new Error(errorMessage);
        }

        return data;
      } catch (error) {
        if (error instanceof TypeError && error.message.includes('fetch')) {
          throw new Error("Network error - please check your connection");
        }
        throw error;
      }
    },
  });
}