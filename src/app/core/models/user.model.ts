// src/app/core/models/user.model.ts

export type UserRole   = 'ADMIN' | 'VENDEUR';
export type UserStatut = 'ACTIF' | 'INACTIF';

export interface User {
  id:                 string;
  nomComplet:         string;
  email:              string;
  role:               UserRole;
  statut:             UserStatut;
  dateCreation:       string;
  derniereConnexion:  string | null;
  premiereConnexion:  boolean;
}

export interface UserStats {
  nombreVentesAujourdhui: number;
  caAujourdhui:           number;
  nombreVentesMois:       number;
  caMois:                 number;
}

export interface UserPage {
  users:      User[];
  page:       number;
  size:       number;
  total:      number;
  totalPages: number;
}

export interface CreateUserPayload {
  nomComplet: string;
  email:      string;
  role:       UserRole;
  password?:  string;
}

export interface UpdateUserPayload {
  nomComplet: string;
  email:      string;
  role:       UserRole;
  statut?:    UserStatut;
}