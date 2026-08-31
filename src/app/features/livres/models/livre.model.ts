// src/app/features/livres/models/livre.model.ts

export interface Livre {
  id: string;
  code: string;
  titre: string;
  description?: string;
  auteur: string;
  maisonEdition: string;
  dateParution?: Date;
  isbn?: string;
  langue: string;
  quantiteStock: number;
  seuilMinimal: number;
  prixVente: number;
  prixAchat?: number;
  emplacement?: string;
  categorie: CategorieSimple;
  statut: 'ACTIF' | 'INACTIF';
  statutStock: 'DISPONIBLE' | 'STOCK_CRITIQUE' | 'RUPTURE';
  stockCritique: boolean;
  enRupture: boolean;
  marge?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategorieSimple {
  id: string;
  nom: string;
  code: string;
}

export interface LivreRequest {
  titre: string;
  description?: string;
  auteur: string;
  maisonEdition: string;
  dateParution?: Date;
  isbn?: string;
  langue: string;
  quantiteStock: number;
  seuilMinimal: number;
  prixVente: number;
  prixAchat?: number;
  emplacement?: string;
  categorieId: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface DoublonInfo {
  titre: string;
  auteur: string;
  prixVente: string;
  numeroLigne: number;
}
 
export interface ImportResultResponse {
  totalLignesLues: number;
  livresAjoutes: number;
  lignesIncompletes: number;
  doublonsTrouves: number;
  doublons: DoublonInfo[];
  lignesIgnoreesDetail: string[];
}