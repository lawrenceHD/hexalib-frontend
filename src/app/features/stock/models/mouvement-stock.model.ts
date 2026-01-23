export enum TypeMouvement {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  AJUSTEMENT = 'AJUSTEMENT',
  RETOUR = 'RETOUR'
}

export interface MouvementStockRequest {
  livreId: string;
  typeMouvement: TypeMouvement;
  quantite: number;
  motif?: string;
  reference?: string;
}

export interface MouvementStockResponse {
  id: string;
  livreId: string;
  titreLivre: string;
  codeLivre: string;
  typeMouvement: TypeMouvement;
  quantite: number;
  stockAvant: number;
  stockApres: number;
  motif?: string;
  reference?: string;
  userId?: string;
  userName?: string;
  dateMouvement: string;
}