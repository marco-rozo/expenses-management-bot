import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import GeminiService from './services/geminiService';
import TranscribeAudioUsecase from './usecases/transcribeAudioUsecase';
import GenerateFriendlyMessageUseCase from './usecases/generateFriendlyMessageUseCase';
import IdentifyExpenseByMessageUsecase from './usecases/identifyExpenseByMessageUsecase';
import CreateExpenseFromMessageUsecase from './usecases/createExpenseFromMessageUsecase';
import ExpenseDatasource from './datasources/expenseDatasource';
import ExpenseService from './services/expenseService';
import GetTodayExpensesByUserIdUsecase from './usecases/getTodayExpensesByUserIdUsecase';
import IdentifyUserIntentUsecase from './usecases/identifyInputUserUsecase';
import ProcedureUserMessageInputUsecase from './usecases/procedureUserMessageInputUsecase';
import GenerateExpenseSummaryUsecase from './usecases/generateExpenseSummaryUsecase';
import GetMonthlyExpensesByUserIdUsecase from './usecases/getMonthlyExpensesByUserIdUsecase';


const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ['--no-sandbox'] },
});

const geminiService = new GeminiService();
const transcribeUsecase = new TranscribeAudioUsecase();
const expenseDatasourse = new ExpenseDatasource();
const expenseService = new ExpenseService(expenseDatasourse);
const generateFriendlyMessageUsecase = new GenerateFriendlyMessageUseCase(geminiService);
const identifyExpenseByMessageUsecase = new IdentifyExpenseByMessageUsecase(geminiService);
const createExpenseFromMessageUsecase = new CreateExpenseFromMessageUsecase(generateFriendlyMessageUsecase, identifyExpenseByMessageUsecase, expenseService);
const getTodayExpensesByUserIdUsecase = new GetTodayExpensesByUserIdUsecase(expenseService);
const getMonthlyExpensesByUserIdUsecase = new GetMonthlyExpensesByUserIdUsecase(expenseService);
const identifyUserIntentUsecase = new IdentifyUserIntentUsecase(geminiService);
const generateExpenseSummaryUsecase = new GenerateExpenseSummaryUsecase(geminiService);
const procedureUserMessageUsecase =
  new ProcedureUserMessageInputUsecase(transcribeUsecase, identifyUserIntentUsecase, createExpenseFromMessageUsecase, generateExpenseSummaryUsecase, getMonthlyExpensesByUserIdUsecase, getTodayExpensesByUserIdUsecase);


console.log('Iniciando o cliente do WhatsApp...');
client.on('qr', (qr) => {
  console.log('QR Code recebido! Copie o texto puro abaixo se o desenho falhar:');
  console.log(qr); 

  console.log('Tentando desenhar o QR Code no terminal:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Cliente do WhatsApp está pronto!');
});

client.on('message', async (message) => {
  try {
    console.log(`Mensagem recebida de: ${message.from}`);
    const response = await procedureUserMessageUsecase.execute({ message });
    console.log('Resposta da intenção do usuário:', response);
    message.reply(response.replyMessage);

  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }

});

client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação!', msg);
});

client.initialize().catch(console.error);
