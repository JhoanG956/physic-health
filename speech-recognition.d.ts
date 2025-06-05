declare global {
    interface SpeechRecognitionEvent extends Event {
      resultIndex: number;
      results: SpeechRecognitionResultList;
    }
  
    interface SpeechRecognitionResult {
      isFinal: boolean;
      alternatives: SpeechRecognitionAlternative[];
    }
  
    interface SpeechRecognitionResultList {
      length: number;
      [index: number]: SpeechRecognitionResult;
    }
  
    interface SpeechRecognitionAlternative {
      transcript: string;
      confidence: number;
    }
  
    interface SpeechRecognition {
      lang: string;
      continuous: boolean;
      interimResults: boolean;
      start(): void;
      stop(): void;
      onresult: (event: SpeechRecognitionEvent) => void;
      onend: () => void;
    }
  
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  }
  
  export {};