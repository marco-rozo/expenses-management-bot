
export enum Category {
  ALIMENTACAO = 'Alimentação',
  TRANSPORTE = 'Transporte',
  MORADIA = 'Moradia',
  LAZER = 'Lazer',
  SAUDE = 'Saúde',
  EDUCACAO = 'Educação',
  OUTROS = 'Outros',
}

export interface Expense {
  _id: string;
  valor: number;
  data: string;
  categoria: Category;
  descricao: string;
  createdAt: string;
  updatedAt: string;
}
