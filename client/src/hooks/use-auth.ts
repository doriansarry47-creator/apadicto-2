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
      const data = await response.json();
      return data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// FIXED LOGIN MUTATION - Corriger l'erreur "body stream already read"
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

      // CORRECTIF : Cloner la réponse pour pouvoir la lire plusieurs fois si nécessaire
      const responseClone = response.clone();
      
      // Tenter de parser comme JSON d'abord
      let data: any;
      let errorMessage: string;
      
      try {
        data = await response.json();
        errorMessage = data?.message || "Erreur de connexion";
      } catch (jsonError) {
        // Si JSON parse échoue, lire comme texte depuis le clone
        try {
          errorMessage = await responseClone.text() || "Erreur inconnue lors de la connexion";
        } catch (textError) {
          errorMessage = "Erreur de communication avec le serveur";
        }
      }

      if (!response.ok) {
        throw new Error(errorMessage);
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

      // CORRECTIF : Cloner la réponse pour éviter l'erreur "body stream already read"
      const responseClone = response.clone();
      
      let data: any;
      let errorMessage: string;
      
      try {
        data = await response.json();
        errorMessage = data?.message || "Registration failed";
      } catch (jsonError) {
        try {
          errorMessage = await responseClone.text() || "Registration failed";
        } catch (textError) {
          errorMessage = "Erreur de communication avec le serveur";
        }
      }

      if (!response.ok) {
        throw new Error(errorMessage);
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
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      // CORRECTIF : Gestion robuste des réponses pour éviter "body stream already read"
      let data: any = {};
      
      if (!response.ok) {
        const responseClone = response.clone();
        let errorMessage: string;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || "Logout failed";
        } catch (jsonError) {
          try {
            errorMessage = await responseClone.text() || "Logout failed";
          } catch (textError) {
            errorMessage = "Erreur de déconnexion";
          }
        }
        
        throw new Error(errorMessage);
      }

      // Tenter de parser la réponse de succès si elle contient du JSON
      try {
        data = await response.json();
      } catch (jsonError) {
        // Si pas de JSON, retourner un objet vide (déconnexion réussie)
        data = { success: true };
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
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // CORRECTIF : Cloner la réponse pour éviter "body stream already read"
      const responseClone = response.clone();
      
      let data: any;
      let errorMessage: string;
      
      try {
        data = await response.json();
        errorMessage = data?.message || "Password reset failed";
      } catch (jsonError) {
        try {
          errorMessage = await responseClone.text() || "Password reset failed";
        } catch (textError) {
          errorMessage = "Erreur de communication avec le serveur";
        }
      }

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      return data;
    },
  });
}