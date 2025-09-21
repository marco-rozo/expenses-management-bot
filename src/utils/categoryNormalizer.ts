import { Category } from '../models/expenseModel';

const categoryMap: { [key: string]: Category } = {
  // --- ALIMENTAÇÃO (Restaurantes, Lanches, Delivery) ---
  'alimentação': Category.ALIMENTACAO,
  'restaurante': Category.ALIMENTACAO,
  'lanche': Category.ALIMENTACAO,
  'delivery': Category.ALIMENTACAO,
  'ifood': Category.ALIMENTACAO,
  'marmita': Category.ALIMENTACAO,
  'almoço': Category.ALIMENTACAO,
  'cafe': Category.ALIMENTACAO,
  'café': Category.ALIMENTACAO,

  // --- MERCADO (Compras de casa) ---
  'mercado': Category.MERCADO,
  'compras': Category.MERCADO,

  // --- ASSINATURAS (Streaming, Serviços) ---
  'assinatura': Category.ASSINATURA,
  'assinaturas': Category.ASSINATURA,
  'netflix': Category.ASSINATURA,
  'streamer': Category.ASSINATURA,
  'prime': Category.ASSINATURA,
  'twitch': Category.ASSINATURA,
  'disney plus': Category.ASSINATURA,
  'spotify': Category.ASSINATURA, // Adicionei como sugestão
  'youtube premium': Category.ASSINATURA, // Adicionei como sugestão

  // --- TRANSPORTE ---
  'transporte': Category.TRANSPORTE,
  'uber': Category.TRANSPORTE,
  '99': Category.TRANSPORTE,
  'gasolina': Category.TRANSPORTE,
  'onibus': Category.TRANSPORTE,
  'ônibus': Category.TRANSPORTE,

  // --- MORADIA ---
  'moradia': Category.MORADIA,
  'casa': Category.MORADIA,
  'aluguel': Category.MORADIA,
  'condomínio': Category.MORADIA,
  'luz': Category.MORADIA,
  'água': Category.MORADIA,
  'internet': Category.MORADIA,

  // --- LAZER ---
  'lazer': Category.LAZER,
  'entretenimento': Category.LAZER,
  'cinema': Category.LAZER,
  'show': Category.LAZER,
  'passeio': Category.LAZER,
  
  // --- SAÚDE ---
  'saúde': Category.SAUDE,
  'saude': Category.SAUDE,
  'farmácia': Category.SAUDE,
  'farmacia': Category.SAUDE,
  'médico': Category.SAUDE,
  'medico': Category.SAUDE,

  // --- EDUCAÇÃO ---
  'educação': Category.EDUCACAO,
  'educacao': Category.EDUCACAO,
  'escola': Category.EDUCACAO,
  'faculdade': Category.EDUCACAO,
  'cursos': Category.EDUCACAO,
  'pós': Category.EDUCACAO,
  'pósgraduação': Category.EDUCACAO,
  'pós graduação': Category.EDUCACAO,

  // --- OUTROS ---
  'outros': Category.OUTROS,
};

export const normalizeCategory = (userInput: string): Category | undefined => {
    if (!userInput) {
        return undefined;
    }
    const lowercasedInput = userInput.toLowerCase();

    // Tenta encontrar uma correspondência direta com os valores do Enum (ex: "Alimentação")
    const enumValues = Object.values(Category).map(v => v.toLowerCase());
    if (enumValues.includes(lowercasedInput)) {
      return Object.values(Category).find(v => v.toLowerCase() === lowercasedInput);
    }

    // Tenta encontrar uma correspondência direta com as chaves do Enum (ex: "ALIMENTACAO")
    const enumKeys = Object.keys(Category).map(k => k.toLowerCase());
    if (enumKeys.includes(lowercasedInput)) {
      const keyIndex = enumKeys.indexOf(lowercasedInput);
      return Object.values(Category)[keyIndex];
    }
    
    // Se não for um valor direto, verifica o mapa de sinônimos
    return categoryMap[lowercasedInput];
};