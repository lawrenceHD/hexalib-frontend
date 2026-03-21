export enum StatutVente {
  VALIDEE = 'VALIDEE',
  ANNULEE = 'ANNULEE'
}

export interface LigneVenteRequest {
  livreId: string;
  quantite: number;
  reductionId?: string; // ← Le vendeur peut choisir une réduction (optionnel)
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

// Interface pour une réduction dans le panier
export interface ReductionDisponible {
  id: string;
  intitule: string;
  type: 'POURCENTAGE' | 'MONTANT_FIXE';
  valeur: number;
  cible: string;
  estValide: boolean;
}

// Interface pour le panier côté client
export interface LignePanier {
  livre: any;
  quantite: number;
  prixUnitaire: number;
  reductionChoisie?: ReductionDisponible | null; // ← Réduction choisie par le vendeur
  reductionsDisponibles: ReductionDisponible[];  // ← Liste des réductions disponibles pour ce livre
  montantReduction: number;
  sousTotal: number;
  showReductions?: boolean; // ← Afficher/masquer le panneau de réductions
}