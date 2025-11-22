import { GUITAR_STRINGS, StringName, TuningResult } from '../types';

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private buffer: Float32Array = new Float32Array(0);

  async start(): Promise<void> {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      
      // FFT Size determines resolution. 2048 is a good balance for latency/accuracy for guitar.
      this.analyser.fftSize = 2048;
      this.buffer = new Float32Array(this.analyser.fftSize);
      
      source.connect(this.analyser);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      throw error;
    }
  }

  stop(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.analyser = null;
  }

  // Autocorrelation algorithm for pitch detection
  // This is more accurate for musical instruments than simple FFT peak detection
  getPitch(): number {
    if (!this.analyser || !this.audioContext) return -1;

    this.analyser.getFloatTimeDomainData(this.buffer);
    
    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = this.buffer.length;

    // Calculate RMS to determine if there is enough volume
    let rms = 0;
    for (let i = 0; i < bufferSize; i++) {
      rms += this.buffer[i] * this.buffer[i];
    }
    rms = Math.sqrt(rms / bufferSize);

    // Noise gate
    if (rms < 0.01) return -1;

    // Autocorrelation
    // We only look for frequencies between 60Hz (Low E is ~82Hz) and 400Hz (High E is ~330Hz)
    // This optimization saves CPU cycles.
    // Period range in samples
    const maxPeriod = Math.floor(sampleRate / 60); 
    const minPeriod = Math.floor(sampleRate / 400);

    let bestPeriod = 0;
    let maxCorrelation = 0;

    for (let period = minPeriod; period <= maxPeriod; period++) {
        let correlation = 0;
        // Check a subset of the buffer for correlation
        for (let i = 0; i < bufferSize - period; i++) {
            correlation += this.buffer[i] * this.buffer[i + period];
        }
        
        // Normalize (optional but helps)
        // Simple comparison
        if (correlation > maxCorrelation) {
            maxCorrelation = correlation;
            bestPeriod = period;
        }
    }

    // Refinement: Parabolic interpolation for better precision
    // Not strictly necessary for a basic tuner but good for smoothness
    
    // Confidence check
    if (maxCorrelation > 0.01 && bestPeriod > 0) {
        return sampleRate / bestPeriod;
    }

    return -1;
  }

  calculateTuningResult(detectedFreq: number, selectedString: StringName): TuningResult | null {
    if (detectedFreq === -1) return null;

    let targetString = GUITAR_STRINGS.find(s => s.name === selectedString);

    // Auto Mode Logic
    if (selectedString === StringName.AUTO || !targetString) {
        // Find the closest string
        let minDiff = Infinity;
        for (const str of GUITAR_STRINGS) {
            const diff = Math.abs(str.frequency - detectedFreq);
            if (diff < minDiff) {
                minDiff = diff;
                targetString = str;
            }
        }
    }

    if (!targetString) return null;

    // Calculate Cents
    // 1200 * log2(f1 / f2)
    const cents = 1200 * Math.log2(detectedFreq / targetString.frequency);

    return {
        note: targetString.display,
        frequency: detectedFreq,
        cents: cents,
        isTuned: Math.abs(cents) < 5 // 5 cents tolerance
    };
  }
}
