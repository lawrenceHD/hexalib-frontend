export interface EvolutionCADTO {
  date: string;
  chiffreAffaires: number;
  nombreVentes: number;
}

export interface LivreStockCritiqueDTO {
  livreId: string;
  code: string;
  titre: string;
  auteur: string;
  categorie: string;
  quantiteStock: number;
  seuilMinimal: number;
  statutStock: 'CRITIQUE' | 'RUPTURE';
}

export interface TopLivreDTO {
  livreId: string;
  code: string;
  titre: string;
  auteur: string;
  categorie: string;
  quantiteVendue: number;
  chiffreAffaires: number;
  nombreVentes: number;
  rang: number;
}

export interface TopCategorieDTO {
  categorieId: string;
  nom: string;
  code: string;
  quantiteVendue: number;
  chiffreAffaires: number;
  nombreVentes: number;
  rang: number;
}

export interface PerformanceVendeurDTO {
  vendeurId: string;
  nomComplet: string;
  nombreVentes: number;
  chiffreAffaires: number;
  nombreLivresVendus: number;
  panierMoyen: number;
  rang: number;
}

export interface AnalyseReductionsDTO {
  montantTotalReductions: number;
  nombreVentesAvecReduction: number;
  pourcentageVentesAvecReduction: number;
  reductionMoyenne: number;
  reductionMaximale: number;
}

export interface RotationStockDTO {
  categorieNom: string;
  quantiteVendue: number;
  stockActuel: number;
  tauxRotation: number;
}

export interface DashboardAdminDTO {
  caJour: number;
  nombreVentesJour: number;
  caMois: number;
  nombreVentesMois: number;
  nombreLivresStockCritique: number;
  livresStockCritique: LivreStockCritiqueDTO[];
  evolutionCA7Jours: EvolutionCADTO[];
  top5LivresMois: TopLivreDTO[];
  performanceVendeurs: PerformanceVendeurDTO[];
  totalLivresCatalogue: number;
  totalCategories: number;
  totalVendeurs: number;
}

export interface DashboardVendeurDTO {
  mesVentesJour: number;
  monCAJour: number;
  mesVentesMois: number;
  monCAMois: number;
  mesMeilleuresVentes: TopLivreDTO[];
  nombreLivresStockCritique: number;
  monClassement: number | null;
  objectifMensuel: number | null;
  tauxAtteinte: number | null;
}

export interface RapportJournalierDTO {
  date: string;
  nombreVentes: number;
  chiffreAffaires: number;
  montantReductions: number;
  nombreLivresVendus: number;
  caParVendeur: PerformanceVendeurDTO[];
  topLivres: TopLivreDTO[];
  topCategories: TopCategorieDTO[];
  alertesStock: LivreStockCritiqueDTO[];
}

export interface RapportPeriodiqueDTO {
  dateDebut: string;
  dateFin: string;
  periode: 'HEBDOMADAIRE' | 'MENSUEL' | 'ANNUEL' | 'PERSONNALISE';
  nombreVentes: number;
  chiffreAffaires: number;
  montantReductions: number;
  nombreLivresVendus: number;
  margeBeneficiaire: number;
  evolutionCA: number;
  evolutionNombreVentes: number;
  evolutionCA7Jours: EvolutionCADTO[];
  topLivres: TopLivreDTO[];
  topCategories: TopCategorieDTO[];
  performanceVendeurs: PerformanceVendeurDTO[];
  analyseReductions: AnalyseReductionsDTO;
  rotationStock: RotationStockDTO[];
}

export type TypePeriode = 'journalier' | 'hebdomadaire' | 'mensuel' | 'annuel' | 'personnalise';