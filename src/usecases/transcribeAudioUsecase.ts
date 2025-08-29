import { SpeechClient } from '@google-cloud/speech';

class TranscribeAudioUsecase {
  private speechClient: SpeechClient;

  constructor() {
    //TODO injetar a dependência
    this.speechClient = new SpeechClient();
  }

  async execute(audioBase64: string): Promise<string | null> {

    const audio = {
      content: audioBase64,
    };

    const config = {
      encoding: 'OGG_OPUS' as const, 
      sampleRateHertz: 16000,
      languageCode: 'pt-BR', 
    }; 

    const request = {
      audio: audio,
      config: config,
    };

    try {
      const [response] = await this.speechClient.recognize(request);
      const transcription = response.results
        ?.map(result => result.alternatives?.[0].transcript)
        .join('\n');
      return transcription || null;
    } catch (error) {
      //TODO criar tratamento de exceções customizadas
      console.error('Error transcribing audio:', error);
      throw error; 
    }
  }
}

export default TranscribeAudioUsecase;