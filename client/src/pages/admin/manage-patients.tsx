import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/navigation";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Patient {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  lastLoginAt?: string;
  lastActivityAt?: string;
  createdAt: string;
  level: number;
  points: number;
}

interface PatientStats {
  exercisesCompleted: number;
  totalDuration: number;
  currentStreak: number;
  averageCraving?: number;
}

export default function ManagePatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients = [], isLoading, error } = useQuery<Patient[]>({
    queryKey: ["/api/admin/patients"],
    retry: 3,
    retryDelay: 1000,
  });

  const deletePatientMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const response = await fetch(`/api/admin/patients/${patientId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/patients"] });
      toast({
        title: "Patient supprimé",
        description: "Le compte patient a été supprimé avec succès.",
      });
      setSelectedPatient(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const togglePatientStatusMutation = useMutation({
    mutationFn: async ({ patientId, isActive }: { patientId: string; isActive: boolean }) => {
      const response = await fetch(`/api/admin/patients/${patientId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la modification");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/patients"] });
      toast({
        title: "Statut modifié",
        description: "Le statut du patient a été modifié avec succès.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredPatients = patients.filter((patient) =>
    patient.role === "patient" &&
    (patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
     `${patient.firstName || ""} ${patient.lastName || ""}`.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getInactivityStatus = (lastActivityAt?: string) => {
    if (!lastActivityAt) return { status: "Jamais connecté", variant: "secondary" as const, days: 0 };
    
    const lastActivity = new Date(lastActivityAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { status: "Actif aujourd'hui", variant: "default" as const, days: 0 };
    if (diffDays <= 7) return { status: `${diffDays} jour(s)`, variant: "default" as const, days: diffDays };
    if (diffDays <= 30) return { status: `${diffDays} jours`, variant: "secondary" as const, days: diffDays };
    return { status: `${diffDays} jours (inactif)`, variant: "destructive" as const, days: diffDays };
  };

  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return "Jamais";
    return formatDistanceToNow(new Date(dateString), { 
      addSuffix: true, 
      locale: fr 
    });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Navigation />
        <Card className="mt-4">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">Erreur de connexion</h3>
              <p className="text-muted-foreground mt-2">
                Impossible de récupérer la liste des patients. Vérifiez votre connexion.
              </p>
              <Button 
                onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/patients"] })}
                className="mt-4"
              >
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Patients</h1>
            <p className="text-muted-foreground">
              Gérez les comptes patients et surveillez leur activité
            </p>
          </div>
          <Badge variant="outline">
            {filteredPatients.length} patient(s)
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Liste des Patients</CardTitle>
              <Input
                placeholder="Rechercher par email ou nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">
                <p>Chargement des patients...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead>Inactivité</TableHead>
                    <TableHead>Niveau/Points</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => {
                    const inactivity = getInactivityStatus(patient.lastActivityAt);
                    return (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {patient.firstName || patient.lastName 
                                ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                                : "Non renseigné"
                              }
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Créé {formatLastActivity(patient.createdAt)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{patient.email}</TableCell>
                        <TableCell>
                          <Badge variant={patient.isActive ? "default" : "secondary"}>
                            {patient.isActive ? "Actif" : "Désactivé"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {formatLastActivity(patient.lastActivityAt)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={inactivity.variant}>
                            {inactivity.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Niveau {patient.level}</div>
                            <div className="text-muted-foreground">{patient.points} pts</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePatientStatusMutation.mutate({
                                patientId: patient.id,
                                isActive: !patient.isActive
                              })}
                            >
                              {patient.isActive ? "Désactiver" : "Activer"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setSelectedPatient(patient)}
                                >
                                  Supprimer
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le compte de{" "}
                                    <strong>{patient.email}</strong> ?
                                    <br />
                                    <br />
                                    <strong>Informations du patient :</strong>
                                    <ul className="mt-2 space-y-1 text-sm">
                                      <li>• Nom : {patient.firstName || patient.lastName 
                                        ? `${patient.firstName || ""} ${patient.lastName || ""}`.trim()
                                        : "Non renseigné"}</li>
                                      <li>• Dernière activité : {formatLastActivity(patient.lastActivityAt)}</li>
                                      <li>• Période d'inactivité : {inactivity.status}</li>
                                      <li>• Niveau : {patient.level} ({patient.points} points)</li>
                                    </ul>
                                    <br />
                                    Cette action est <strong>irréversible</strong> et supprimera toutes les données du patient.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setSelectedPatient(null)}>
                                    Annuler
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deletePatientMutation.mutate(patient.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Supprimer définitivement
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
            
            {!isLoading && filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? "Aucun patient trouvé avec ce critère de recherche."
                    : "Aucun patient enregistré pour le moment."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}