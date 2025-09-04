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
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        throw new Error("Failed to fetch user");
      }
      
      // Safely parse response as JSON with error handling
      try {
        const data = await response.json();
        return data.user;
      } catch {
        // If response is not valid JSON, throw an error
        throw new Error("Invalid response format");
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// PATCHED LOGIN MUTATION
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Correction robuste : tente de parser la réponse comme JSON, sinon récupère le texte
      // Clone response before reading to avoid "body stream already read" error
      let data: any;
      let text: string | undefined;
      const responseClone = response.clone();
      
      try {
        data = await response.json();
      } catch {
        // Use the cloned response to read as text since original stream is consumed
        text = await responseClone.text();
      }

      if (!response.ok) {
        throw new Error(
          (data && data.message) ||
          text ||
          "Erreur inconnue lors de la connexion"
        );
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        // Clone response before reading to avoid "body stream already read" error
        const responseClone = response.clone();
        let error: any;
        try {
          error = await response.json();
        } catch {
          // If JSON parsing fails, use cloned response to read as text
          const text = await responseClone.text();
          error = { message: text || "Registration failed" };
        }
        throw new Error(error.message || "Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Safely parse response as JSON with error handling
      try {
        return response.json();
      } catch {
        // If response is not valid JSON, return empty object
        return {};
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        // Clone response before reading to avoid "body stream already read" error
        const responseClone = response.clone();
        let error: any;
        try {
          error = await response.json();
        } catch {
          // If JSON parsing fails, use cloned response to read as text
          const text = await responseClone.text();
          error = { message: text || "Password reset failed" };
        }
        throw new Error(error.message || "Password reset failed");
      }

      // Safely parse response as JSON with error handling
      try {
        return response.json();
      } catch {
        // If response is not valid JSON, return empty object
        return {};
      }
    },
  });
}