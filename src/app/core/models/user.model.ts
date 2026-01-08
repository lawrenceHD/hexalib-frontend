export interface User {
  id: string;
  nomComplet: string;
  email: string;
  role: UserRole;
  statut: UserStatut;
  dateCreation: string;
  derniereConnexion: string | null;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VENDEUR = 'VENDEUR'
}

export enum UserStatut {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF'
}