
import { Category } from '../models/expenseModel';

const categoryMap: { [key: string]: Category } = {
  'alimentação': Category.ALIMENTACAO,
  'comida': Category.ALIMENTACAO,
  'mercado': Category.ALIMENTACAO,
  'restaurante': Category.ALIMENTACAO,

  'transporte': Category.TRANSPORTE,
  'uber': Category.TRANSPORTE,
  '99': Category.TRANSPORTE,
  'gasolina': Category.TRANSPORTE,
  'onibus': Category.TRANSPORTE,
  'ônibus': Category.TRANSPORTE,

  'moradia': Category.MORADIA,
  'casa': Category.MORADIA,
  'aluguel': Category.MORADIA,
  'condomínio': Category.MORADIA,
  'luz': Category.MORADIA,
  'água': Category.MORADIA,
  'internet': Category.MORADIA,

  'lazer': Category.LAZER,
  'entretenimento': Category.LAZER,
  'cinema': Category.LAZER,
  'show': Category.LAZER,

  'saúde': Category.SAUDE,
  'saude': Category.SAUDE,
  'farmácia': Category.SAUDE,
  'farmacia': Category.SAUDE,
  'médico': Category.SAUDE,
  'medico': Category.SAUDE,

  'educação': Category.EDUCACAO,
  'educacao': Category.EDUCACAO,
  'escola': Category.EDUCACAO,
  'faculdade': Category.EDUCACAO,
  'cursos': Category.EDUCACAO,

  'outros': Category.OUTROS,
};

export const normalizeCategory = (userInput: string): Category | undefined => {
    if (!userInput) {
        return undefined;
    }
    const lowercasedInput = userInput.toLowerCase();

    const enumValues = Object.values(Category).map(v => v.toLowerCase());
    const enumKeys = Object.keys(Category).map(k => k.toLowerCase());

    if (enumValues.includes(lowercasedInput)) {
      return Object.values(Category).find(v => v.toLowerCase() === lowercasedInput);
    }

    if (enumKeys.includes(lowercasedInput)) {
      const keyIndex = enumKeys.indexOf(lowercasedInput);
      return Object.values(Category)[keyIndex];
    }
    
    // Se não for um valor direto, verifica o mapa de sinônimos
    return categoryMap[lowercasedInput];
};
