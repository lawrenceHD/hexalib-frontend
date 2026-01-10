// src/app/features/fournisseurs/models/fournisseur.model.ts

export interface Fournisseur {
  id: string;
  nom: string;
  contact?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  delaiLivraisonJours?: number;
  statut: 'ACTIF' | 'INACTIF';
  createdAt: Date;
  updatedAt: Date;
}

export interface FournisseurRequest {
  nom: string;
  contact?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
  delaiLivraisonJours?: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}