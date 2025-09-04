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
      let response: Response;
      
      try {
        response = await fetch("/api/auth/me");
      } catch (networkError) {
        // Network errors should not prevent the app from working
        // Return null to indicate user is not authenticated
        return null;
      }
      
      if (!response.ok) {
        if (response.status === 401) {
          return null;
        }
        // For other errors, try to get the error message
        let errorMessage = "Failed to fetch user";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Ignore JSON parsing errors for auth check
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      return data.user;
    },
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized) or 403 (forbidden)
      if (error?.message?.includes("401") || error?.message?.includes("403")) {
        return false;
      }
      // Retry up to 2 times for other errors (like network issues)
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// PATCHED LOGIN MUTATION
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      let response: Response;
      
      try {
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
      } catch (networkError) {
        throw new Error("Erreur de connexion - Vérifiez votre connexion Internet");
      }

      // Correction robuste : tente de parser la réponse comme JSON, sinon récupère le texte
      let data: any;
      let text: string | undefined;
      try {
        data = await response.json();
      } catch {
        text = await response.text();
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
      let response: Response;
      
      try {
        response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } catch (networkError) {
        throw new Error("Erreur de connexion - Vérifiez votre connexion Internet");
      }

      // Robust error handling with JSON/text fallback
      let data: any;
      let text: string | undefined;
      try {
        data = await response.json();
      } catch {
        text = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          (data && data.message) ||
          text ||
          "Erreur inconnue lors de l'inscription"
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

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      let response: Response;
      
      try {
        response = await fetch("/api/auth/logout", {
          method: "POST",
        });
      } catch (networkError) {
        throw new Error("Erreur de connexion - Vérifiez votre connexion Internet");
      }

      // Robust error handling with JSON/text fallback
      let data: any;
      let text: string | undefined;
      try {
        data = await response.json();
      } catch {
        text = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          (data && data.message) ||
          text ||
          "Erreur inconnue lors de la déconnexion"
        );
      }

      return data;
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
      let response: Response;
      
      try {
        response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
      } catch (networkError) {
        throw new Error("Erreur de connexion - Vérifiez votre connexion Internet");
      }

      // Robust error handling with JSON/text fallback
      let data: any;
      let text: string | undefined;
      try {
        data = await response.json();
      } catch {
        text = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          (data && data.message) ||
          text ||
          "Erreur inconnue lors de la réinitialisation"
        );
      }

      return data;
    },
  });
}