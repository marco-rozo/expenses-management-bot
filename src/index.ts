import { Client } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { isAudioFile } from './utils/isAudioFile';
import TranscribeAudioUsecase from './usecases/transcribeAudioUsecase';

console.log('Iniciando o cliente do WhatsApp...');

const client = new Client({
});

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
    if (message.hasMedia) {
      const media = await message.downloadMedia();

      if (isAudioFile(media.mimetype)) {
        console.log('Mensagem contém um arquivo de áudio.');
        const audioBase64 = media.data;
        //TODO injetar a dependência
        const transcribeUsecase = new TranscribeAudioUsecase();

        transcribeUsecase.execute(audioBase64)
          .then(transcribedText => {
            console.log('Texto Transcrito:', transcribedText);
            if (transcribedText) {
              message.reply(`Texto transcrito: ${transcribedText}`);
            }
          })
          .catch(error => {
            console.error('Erro ao transcrever áudio:', error);
          });

      }
    } else {
      console.log(`Conteúdo: ${message.body}`);
    }
  } catch (error) {
    console.error('Erro ao processar a mensagem:', error);
  }

});

client.on('auth_failure', (msg) => {
  console.error('Falha na autenticação!', msg);
});

client.initialize().catch(console.error);
