export enum TypeReduction {
  POURCENTAGE = 'POURCENTAGE',
  MONTANT_FIXE = 'MONTANT_FIXE'
}

export enum CibleReduction {
  GLOBALE = 'GLOBALE',
  LIVRE = 'LIVRE',
  CATEGORIE = 'CATEGORIE'
}

export interface Reduction {
  id: string;
  intitule: string;
  description?: string;
  type: TypeReduction;
  valeur: number;
  cible: CibleReduction;
  cibleId?: string;
  cibleNom?: string;
  dateDebut: string;
  dateFin: string;
  actif: boolean;
  estValide: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReductionRequest {
  intitule: string;
  description?: string;
  type: TypeReduction;
  valeur: number;
  cible: CibleReduction;
  cibleId?: string;
  dateDebut: string;
  dateFin: string;
  actif: boolean;
}