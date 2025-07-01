
import React from 'react';
import { Language } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'it-IT', name: 'Italian (Italy)' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'ru-RU', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)'}
];

export const DEFAULT_SOURCE_LANG = 'en-US';
export const DEFAULT_TARGET_LANG = 'es-ES';

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// SVG Icons (Heroicons Outline & Custom)
export const MicrophoneIcon: React.FC<IconProps> = ({className = "w-8 h-8", style}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15c-1.125 0-2.25-.1303-3.335-.371M12 15c1.125 0 2.25-.1303 3.335-.371m-6.67 1.871A5.962 5.962 0 0 1 6 12.75V11.25m6.67 3.371C14.607 14.33 15 13.556 15 12.75V11.25m.75 1.5a4.502 4.502 0 0 0-9 0" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a2.25 2.25 0 002.25-2.25v-4.5a2.25 2.25 0 00-4.5 0v4.5A2.25 2.25 0 0012 12.75z" />
  </svg>
);

export const StopCircleIcon: React.FC<IconProps> = ({className = "w-8 h-8", style}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" />
  </svg>
);

export const SpeakerWaveIcon: React.FC<IconProps> = ({className = "w-5 h-5", style}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
  </svg>
);

export const ArrowPathIcon: React.FC<IconProps> = ({className = "w-6 h-6", style}) => ( // Retry icon
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const SwapIcon: React.FC<IconProps> = ({className = "w-5 h-5", style}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 7.5m0 0L16.5 12M21 7.5H3" />
    </svg>
);

export const CopyIcon: React.FC<IconProps> = ({className = "w-5 h-5", style}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376H3.875a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125h9.75c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125Zm0 0h0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 15.75H14.25c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H9.75A1.125 1.125 0 0 0 8.625 5.625v9c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
);

export const ShareIcon: React.FC<IconProps> = ({className = "w-5 h-5", style}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.783 10.907a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 15.407a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 13.157l4.783-2.25M12 10.843l4.783 2.25M7.217 13.157l4.783 2.25" />
    </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = ({className = "w-5 h-5", style}) => ( // For "Translate Text" button
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({className = "w-5 h-5", style}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

// Social Media Icons
export const BlogIcon: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25H5.625a2.25 2.25 0 0 1-2.25-2.25V6.375c0-.621.504-1.125 1.125-1.125h3.375c.621 0 1.125.504 1.125 1.125V7.5Zm0 0h1.5m-1.5 0P8.625 7.5v1.5c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V7.5Z" />
  </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a2 2 0 00-.1.75V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
  </svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919A48.035 48.035 0 0112 2.163zm0 1.441a46.408 46.408 0 00-4.794.07c-2.79.13-3.921 1.139-4.045 3.968-.057 1.25-.067 1.606-.067 4.66s.01 3.409.067 4.66c.124 2.828 1.255 3.838 4.045 3.967.97.045 1.402.062 4.794.062 3.391 0 3.824-.017 4.794-.062 2.79-.13 3.921-1.14 4.045-3.968.057-1.25.067-1.606-.067 4.66s-.01-3.409-.067-4.66c-.124-2.828-1.255-3.838-4.045-3.967A46.408 46.408 0 0012 3.604zm0 4.232a4.163 4.163 0 100 8.326 4.163 4.163 0 000-8.326zm0 1.441a2.722 2.722 0 110 5.444 2.722 2.722 0 010-5.444zM16.802 6.11a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path>
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 006.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 012.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.025 2.75-1.025.55 1.375.2 2.4.1 2.65.637.7 1.025 1.6 1.025 2.688 0 3.837-2.337 4.687-4.562 4.937.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0022 12c0-5.525-4.475-10-10-10z"></path>
  </svg>
);

export const XIcon: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className={className} style={style}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const YouTubeIcon: React.FC<IconProps> = ({ className = "w-5 h-5", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
    <path d="M21.582 7.643A2.463 2.463 0 0019.803 6.1C18.233 5.5 12 5.5 12 5.5s-6.233 0-7.803.6c-.52.15-1.63.14-2.02.543A2.46 2.46 0 00.197 7.643c-.22.61-.197 3.012-.197 4.357s-.023 3.747.197 4.357a2.463 2.463 0 001.779 1.543c1.57.6 7.803.6 7.803.6s6.233 0 7.803-.6a2.463 2.463 0 001.779-1.543c.22-.61.197-3.012.197-4.357s.023-3.747-.197-4.357zM9.75 14.828V9.172l5.333 2.828-5.333 2.828z"></path>
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export const InformationCircleIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className = "w-6 h-6", style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


// Check if navigator.share is available
export const IS_SHARE_SUPPORTED = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
