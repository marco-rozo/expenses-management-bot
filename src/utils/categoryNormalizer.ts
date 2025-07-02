
import { Category } from '../models/expenseModel';

// Um mapa para sinônimos ou variações comuns. As chaves são as entradas do usuário (em minúsculas), os valores são a categoria oficial do enum.
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

/**
 * Normaliza a entrada de categoria do usuário para um valor do enum Category.
 * @param userInput A string de categoria fornecida pelo usuário.
 * @returns O valor correspondente do enum Category ou undefined se não houver correspondência.
 */
export const normalizeCategory = (userInput: string): Category | undefined => {
    if (!userInput) {
        return undefined;
    }
    const lowercasedInput = userInput.toLowerCase();

    // Verifica se a entrada corresponde a um dos valores literais do enum (ex: 'Moradia')
    // ou a uma das chaves do enum (ex: 'MORADIA')
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
