// ═══════════════════════════════════════════════════
// CATÉGORIES DÉPENSES
// ═══════════════════════════════════════════════════

export interface CategorieDepenseRequest {
  nom: string;
  description?: string;
}

export interface CategorieDepenseResponse {
  id: string;
  nom: string;
  description?: string;
  statut: 'ACTIF' | 'INACTIF';
  createdAt: string;
}

// ═══════════════════════════════════════════════════
// DÉPENSES
// ═══════════════════════════════════════════════════

export interface DepenseRequest {
  description: string;
  montant: number;
  dateDepense: string;
  categorieId: string;
  reference?: string;
}

export interface DepenseResponse {
  id: string;
  description: string;
  montant: number;
  dateDepense: string;
  categorieId: string;
  categorieNom: string;
  reference?: string;
  enregistreParNom?: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════
// DASHBOARD COMPTA
// ═══════════════════════════════════════════════════

export interface DepenseParCategorie {
  categorieNom: string;
  montant: number;
  nombreDepenses: number;
  pourcentage: number;
}

export interface DashboardComptaDTO {
  periode: string;
  totalEntrees: number;
  nombreVentes: number;
  totalSorties: number;
  nombreDepenses: number;
  soldeNet: number;
  totalReductions: number;
  depensesParCategorie: DepenseParCategorie[];
  top5Categories: DepenseParCategorie[];
}

// ═══════════════════════════════════════════════════
// RAPPORT VENTES
// ═══════════════════════════════════════════════════

export type TypeRapportVentes = 'AVEC_REDUCTION' | 'SANS_REDUCTION' | 'COMBINE';

export interface LigneVenteRapport {
  numeroFacture: string;
  dateVente: string;
  vendeurNom: string;
  montantHT: number;
  montantReduction: number;
  montantTTC: number;
  nombreArticles: number;
  aReduction: boolean;
}

export interface RapportVentesDTO {
  dateDebut: string;
  dateFin: string;
  typeRapport: TypeRapportVentes;
  nombreVentes: number;
  caTotal: number;
  totalReductions: number;
  caNnet: number;
  nombreVentesAvecReduction: number;
  caVentesAvecReduction: number;
  montantReductionsAccordees: number;
  nombreVentesSansReduction: number;
  caVentesSansReduction: number;
  ventes: LigneVenteRapport[];
}

// ═══════════════════════════════════════════════════
// RAPPORT COMPTE DE RÉSULTAT
// ═══════════════════════════════════════════════════

export interface ChargeParCategorie {
  categorieNom: string;
  montant: number;
  nombreDepenses: number;
  pourcentageDesCharges: number;
}

export interface RapportCompteResultatDTO {
  dateDebut: string;
  dateFin: string;
  caVentes: number;
  totalReductionsAccordees: number;
  caNet: number;
  totalCharges: number;
  chargesParCategorie: ChargeParCategorie[];
  resultatNet: number;
  beneficiaire: boolean;
}

// ═══════════════════════════════════════════════════
// RAPPORT TRÉSORERIE
// ═══════════════════════════════════════════════════

export interface FluxTresorerie {
  date: string;
  type: 'ENTREE' | 'SORTIE';
  libelle: string;
  categorie: string;
  montant: number;
  reference?: string;
  enregistrePar?: string;
}

export interface RapportTresorerieDTO {
  dateDebut: string;
  dateFin: string;
  totalEntrees: number;
  totalSorties: number;
  soldeNet: number;
  flux: FluxTresorerie[];
}

// ═══════════════════════════════════════════════════
// RAPPORT STOCK VALORISÉ
// ═══════════════════════════════════════════════════

export interface StockParCategorie {
  categorieNom: string;
  categorieCode: string;
  nombreLivres: number;
  quantiteTotale: number;
  valeurPrixVente: number;
}

export interface LivreStockInfo {
  code: string;
  titre: string;
  auteur: string;
  categorieNom: string;
  quantiteStock: number;
  seuilMinimal: number;
  prixVente: number;
}

export interface RapportStockValoriseDTO {
  dateGeneration: string;
  valeurTotaleStockPrixVente: number;
  totalLivresEnStock: number;
  totalLivresEnRupture: number;
  totalLivresCritiques: number;
  stockParCategorie: StockParCategorie[];
  livresEnRupture: LivreStockInfo[];
  livresCritiques: LivreStockInfo[];
}

// ═══════════════════════════════════════════════════
// PAGINATION
// ═══════════════════════════════════════════════════

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}