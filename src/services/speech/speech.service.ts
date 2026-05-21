export class SpeechService {
  speakFrench(text: string): void {
    if (!this.isSupported() || !text.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  cancel(): void {
    if (!this.isSupported()) {
      return;
    }

    window.speechSynthesis.cancel();
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }
}

export const speechService = new SpeechService();
