
export interface Language {
  code: string;
  name: string;
}

export enum TranslationStage {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  TRANSCRIBING = 'TRANSCRIBING', // Technically, Web Speech API gives transcript directly
  TRANSLATING = 'TRANSLATING',
  SPEAKING = 'SPEAKING',
  ERROR = 'ERROR',
}

export type Theme = 'light' | 'dark';

// --- Web Speech API Types ---

// Speech Recognition Interfaces
interface SpeechRecognitionEventMap {
    "audiostart": Event;
    "soundstart": Event;
    "speechstart": Event;
    "speechend": Event;
    "soundend": Event;
    "audioend": Event;
    "result": SpeechRecognitionEvent;
    "nomatch": SpeechRecognitionEvent;
    "error": SpeechRecognitionErrorEvent;
    "start": Event;
    "end": Event;
}

export interface SpeechRecognitionStatic {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
}

export interface SpeechRecognition extends EventTarget {
    grammars: SpeechGrammarList;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    serviceURI: string;

    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;

    abort(): void;
    start(): void;
    stop(): void;

    addEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SpeechRecognitionEventMap>(type: K, listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionErrorEvent extends Event {
    readonly error: SpeechRecognitionErrorCode;
    readonly message: string;
}

export type SpeechRecognitionErrorCode =
  | "no-speech"
  | "aborted"
  | "audio-capture"
  | "network"
  | "not-allowed"
  | "service-not-allowed"
  | "bad-grammar"
  | "language-not-supported";

export interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

export interface SpeechGrammar {
    src: string;
    weight: number;
}

export interface SpeechGrammarList {
    readonly length: number;
    item(index: number): SpeechGrammar;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    [index: number]: SpeechGrammar;
}

// Speech Synthesis Interfaces
export interface SpeechSynthesisVoice {
    readonly default: boolean;
    readonly lang: string;
    readonly localService: boolean;
    readonly name: string;
    readonly voiceURI: string;
}

interface SpeechSynthesisEventMap {
    "voiceschanged": Event;
}

export interface SpeechSynthesis extends EventTarget {
    readonly pending: boolean;
    readonly speaking: boolean;
    readonly paused: boolean;

    onvoiceschanged: ((this: SpeechSynthesis, ev: Event) => any) | null;

    cancel(): void;
    getVoices(): SpeechSynthesisVoice[];
    pause(): void;
    resume(): void;
    speak(utterance: SpeechSynthesisUtterance): void;
    
    addEventListener<K extends keyof SpeechSynthesisEventMap>(type: K, listener: (this: SpeechSynthesis, ev: SpeechSynthesisEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SpeechSynthesisEventMap>(type: K, listener: (this: SpeechSynthesis, ev: SpeechSynthesisEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

interface SpeechSynthesisUtteranceEventMap {
    "start": SpeechSynthesisEvent;
    "end": SpeechSynthesisEvent;
    "error": SpeechSynthesisErrorEvent;
    "pause": SpeechSynthesisEvent;
    "resume": SpeechSynthesisEvent;
    "mark": SpeechSynthesisEvent;
    "boundary": SpeechSynthesisEvent;
}

export interface SpeechSynthesisUtterance extends EventTarget {
    text: string;
    lang: string;
    voice: SpeechSynthesisVoice | null;
    volume: number;
    rate: number;
    pitch: number;

    onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;
    onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;
    onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => any) | null;
    onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;
    onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;
    onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;
    onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => any) | null;

    addEventListener<K extends keyof SpeechSynthesisUtteranceEventMap>(type: K, listener: (this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof SpeechSynthesisUtteranceEventMap>(type: K, listener: (this: SpeechSynthesisUtterance, ev: SpeechSynthesisUtteranceEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

export interface SpeechSynthesisEvent extends Event {
    readonly utterance: SpeechSynthesisUtterance;
    readonly charIndex: number;
    readonly elapsedTime: number;
    readonly name: string;
}

export interface SpeechSynthesisErrorEvent extends SpeechSynthesisEvent {
    readonly error: string; 
}

export declare var SpeechSynthesisUtterance: {
    prototype: SpeechSynthesisUtterance;
    new(text?: string): SpeechSynthesisUtterance;
};

// Augment Window interface
declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionStatic;
        webkitSpeechRecognition?: SpeechRecognitionStatic;
        SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
        // The 'speechSynthesis: SpeechSynthesis;' line below was removed
        // as it conflicts with the standard lib.dom.d.ts declaration.
        // The global window.speechSynthesis will be typed by the standard library,
        // which is compatible with the SpeechSynthesis related types defined in this file.
    }
}