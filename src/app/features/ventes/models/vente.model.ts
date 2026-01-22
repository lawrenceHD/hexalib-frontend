export enum StatutVente {
  VALIDEE = 'VALIDEE',
  ANNULEE = 'ANNULEE'
}

export interface LigneVenteRequest {
  livreId: string;
  quantite: number;
}

export interface VenteRequest {
  lignes: LigneVenteRequest[];
}

export interface LigneVenteResponse {
  id: string;
  livreId: string;
  titreLivre: string;
  codeLivre: string;
  prixUnitaire: number;
  quantite: number;
  reductionId?: string;
  reductionIntitule?: string;
  montantReduction: number;
  sousTotal: number;
}

export interface VenteResponse {
  id: string;
  numeroFacture: string;
  dateVente: string;
  vendeurId: string;
  vendeurNom: string;
  montantHT: number;
  montantReductions: number;
  montantTTC: number;
  statut: StatutVente;
  motifAnnulation?: string;
  lignes: LigneVenteResponse[];
  createdAt: string;
}

export interface VendeurStatsResponse {
  nombreVentes: number;
  chiffreAffaires: number;
}

export interface GlobalStatsResponse {
  date: string;
  nombreVentes: number;
  chiffreAffaires: number;
}

// Interface pour le panier côté client
export interface LignePanier {
  livre: any; // Type Livre de votre module livres
  quantite: number;
  prixUnitaire: number;
  reductionAppliquee?: any; // Type Reduction
  montantReduction: number;
  sousTotal: number;
}