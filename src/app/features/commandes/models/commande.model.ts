// src/app/features/commandes/models/commande.model.ts

import { Fournisseur } from '../../fournisseurs/models/fournisseur.model';

export interface CommandeFournisseur {
  id: string;
  numeroCommande: string;
  fournisseur: FournisseurSimple;
  dateCommande: Date;
  dateReceptionPrevue?: Date;
  dateReceptionReelle?: Date;
  montantTotal: number;
  statut: 'EN_ATTENTE' | 'RECUE' | 'ANNULEE';
  notes?: string;
  createdByName?: string;
  lignes: LigneCommande[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FournisseurSimple {
  id: string;
  nom: string;
  contact?: string;
  telephone?: string;
  email?: string;
  adresse?: string;
}

export interface LigneCommande {
  id?: string;
  livreId: string;
  livreTitre: string;
  livreCode: string;
  quantite: number;
  prixAchatUnitaire: number;
  sousTotal: number;
}

export interface CommandeFournisseurRequest {
  fournisseurId: string;
  dateCommande: Date | string;
  dateReceptionPrevue?: Date | string;
  notes?: string;
  lignes: LigneCommandeRequest[];
}

export interface LigneCommandeRequest {
  livreId: string;
  quantite: number;
  prixAchatUnitaire: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}