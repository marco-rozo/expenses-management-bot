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
const createExpenseFromMessageUsecase = new CreateExpenseFromMessageUsecase(transcribeUsecase, generateFriendlyMessageUsecase, identifyExpenseByMessageUsecase, expenseService);
const getTodayExpensesByUserIdUsecase = new GetTodayExpensesByUserIdUsecase(expenseService);


console.log('Iniciando o cliente do WhatsApp...');
client.on('qr', (qr) => {
  console.log('QR Code recebido, escaneie com o seu celular.');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Cliente do WhatsApp está pronto!');
});

client.on('message', async (message) => {
  try {
    console.log(`Mensagem recebida de: ${message.from}`);
    const response = await createExpenseFromMessageUsecase.execute({ message })
    // const response = await getTodayExpensesByUserIdUsecase.execute(message.from); 

    // console.log('Resposta gerada:', response);
    message.reply(response.replyMessage);
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }

});

client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação!', msg);
});

client.initialize().catch(console.error);
