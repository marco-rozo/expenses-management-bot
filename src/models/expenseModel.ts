
export enum Category {
  ALIMENTACAO = 'Alimentação',
  TRANSPORTE = 'Transporte',
  MORADIA = 'Moradia',
  LAZER = 'Lazer',
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  OUTROS = 'Outros',
  // Novas categorias
  MERCADO = 'Mercado',
  ASSINATURA = 'Assinatura',
}

export interface Expense {
  id: string | null;
  userId: string;
  valor: number;
  categoria: Category;
  originalMessage: string;
  formatMessage: string;
  createdAt: string;
  updatedAt: string;
}