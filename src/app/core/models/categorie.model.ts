export interface Categorie {
  id: string;
  nom: string;
  description: string;
  code: string;
  statut: CategorieStatut;
  createdAt: string;
  updatedAt: string;
}

export enum CategorieStatut {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF'
}

export interface CategorieRequest {
  nom: string;
  description?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}