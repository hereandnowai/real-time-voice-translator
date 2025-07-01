
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TranslationStage, SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent, SpeechSynthesisEvent, SpeechSynthesisErrorEvent, Theme } from './types.ts';
import { 
    SUPPORTED_LANGUAGES, DEFAULT_SOURCE_LANG, DEFAULT_TARGET_LANG, 
    MicrophoneIcon, StopCircleIcon, SpeakerWaveIcon, SwapIcon, CopyIcon, ShareIcon as ShareActionIcon, PaperAirplaneIcon, ArrowPathIcon, CheckCircleIcon,
    BlogIcon, LinkedInIcon, InstagramIcon, GitHubIcon, XIcon, YouTubeIcon, // Social Media Icons
    SunIcon, MoonIcon, InformationCircleIcon, // Theme and Info Icons
    IS_SHARE_SUPPORTED
} from './constants.tsx';
import LanguageSelector from './components/LanguageSelector.tsx';
import IconButton from './components/IconButton.tsx';
import { translateText } from './services/geminiService.ts';
import Spinner from './components/Spinner.tsx';
import AboutModal from './components/AboutModal.tsx'; // Import AboutModal

// Branding
const BRAND_INFO = {
  organizationShortName: "HERE AND NOW AI",
  organizationLongName: "HERE AND NOW AI - Artificial Intelligence Research Institute",
  slogan: "designed with passion for innovation",
  logoTitle: "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png",
  socialMedia: {
    blog: "https://hereandnowai.com/blog",
    linkedin: "https://www.linkedin.com/company/hereandnowai/",
    instagram: "https://instagram.com/hereandnow_ai",
    github: "https://github.com/hereandnowai",
    x: "https://x.com/hereandnow_ai",
    youtube: "https://youtube.com/@hereandnow_ai"
  },
  developer: "Bilmia M Binson"
};

const BrowserSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSynthesis = window.speechSynthesis;

const App: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useState<string>(DEFAULT_SOURCE_LANG);
  const [targetLanguage, setTargetLanguage] = useState<string>(DEFAULT_TARGET_LANG);
  const [originalText, setOriginalText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [stage, setStage] = useState<TranslationStage>(TranslationStage.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean>(true);
  const [showCopySuccess, setShowCopySuccess] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState<boolean>(false); // State for About Modal
  
  const copySuccessTimeoutRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  // Theme initialization and persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isAboutModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { // Cleanup on component unmount
      document.body.style.overflow = 'unset';
    };
  }, [isAboutModalOpen]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const clearCopySuccessMessage = useCallback(() => {
    if (copySuccessTimeoutRef.current) {
      clearTimeout(copySuccessTimeoutRef.current);
    }
    setShowCopySuccess(false);
  }, []);

  const triggerCopySuccessMessage = useCallback(() => {
    clearCopySuccessMessage();
    setShowCopySuccess(true);
    copySuccessTimeoutRef.current = window.setTimeout(() => { // Use window.setTimeout for clarity in browser context
      setShowCopySuccess(false);
    }, 2000);
  }, [clearCopySuccessMessage]);

  const speakText = useCallback((text: string, lang: string) => {
    if (!speechSynthesis || !text) {
        if (stageRef.current === TranslationStage.SPEAKING) {
            setStage(TranslationStage.IDLE);
        }
        return;
    }
    try {
        speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        
        utterance.onend = () => {
          if (stageRef.current === TranslationStage.SPEAKING) {
            setStage(TranslationStage.IDLE);
          }
        };

        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          console.error('Speech synthesis error:', event.error, '| current app stage:', stageRef.current);
          
          if ((event.error === 'interrupted' || event.error === 'canceled') && stageRef.current !== TranslationStage.SPEAKING) {
            console.log("Speech interruption/cancellation was likely intentional due to user action. Current stage:", stageRef.current);
            return;
          }

          let specificError = 'Failed to speak the translated text.';
          if (event.error === 'canceled') {
            specificError = 'Speech output was canceled.';
          } else if (event.error === 'interrupted') {
            specificError = 'Speech output was interrupted.';
          } else if (event.error) {
            specificError = `Speech synthesis failed: ${event.error}.`;
          }
          
          setError(specificError);
          if (stageRef.current === TranslationStage.SPEAKING || (event.error !== 'interrupted' && event.error !== 'canceled')) {
             setStage(TranslationStage.ERROR);
          }
        };
        speechSynthesis.speak(utterance);
    } catch (e) {
        console.error("Error initiating speech synthesis:", e);
        setError("Could not play translated audio due to an unexpected issue.");
        setStage(TranslationStage.ERROR);
    }
  }, []);

  const handleTranslation = useCallback(async (text: string, srcLang: string, tgtLang: string) => {
    if (!text.trim()) {
      setError("Cannot translate empty text. Please enter or speak some text.");
      setStage(TranslationStage.IDLE); 
      setOriginalText(text); 
      setTranslatedText('');
      return;
    }
    setError(null);
    setStage(TranslationStage.TRANSLATING);
    try {
      const currentSourceLangObj = SUPPORTED_LANGUAGES.find(l => l.code === srcLang);
      const currentTargetLangObj = SUPPORTED_LANGUAGES.find(l => l.code === tgtLang);

      if (!currentSourceLangObj || !currentTargetLangObj) {
        setError("Invalid source or target language selected.");
        setStage(TranslationStage.ERROR);
        return;
      }

      const translation = await translateText(text, currentSourceLangObj.name, currentTargetLangObj.name);
      setTranslatedText(translation);
      setStage(TranslationStage.SPEAKING); 
      speakText(translation, tgtLang);
    } catch (apiError: any) {
      console.error('Translation error:', apiError);
      setError(`Translation failed: ${apiError.message || 'Unknown error'}`);
      setStage(TranslationStage.ERROR);
    }
  }, [speakText]); 

  useEffect(() => {
    if (!BrowserSpeechRecognition || !speechSynthesis) {
      setIsBrowserSupported(false);
      setError("Your browser does not support the Web Speech API, which is required for this application to function fully.");
      setStage(TranslationStage.ERROR);
      return;
    }

    const recognitionInstance = new BrowserSpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = sourceLanguage;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setOriginalText(transcript);
      handleTranslation(transcript, sourceLanguage, targetLanguage);
    };

    recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = 'Speech recognition failed.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'aborted' && stageRef.current === TranslationStage.RECORDING) {
        errorMessage = 'Recording was unexpectedly stopped. Please try again.';
      } else if (event.error === 'aborted') { 
        setStage(TranslationStage.IDLE); return; 
      }
      setError(errorMessage);
      setStage(TranslationStage.ERROR);
    };
    
    recognitionInstance.onstart = () => {
      setStage(TranslationStage.RECORDING);
      setError(null); 
      clearCopySuccessMessage();
    };

    recognitionInstance.onend = () => {
      if (stageRef.current === TranslationStage.RECORDING) {
         setStage(TranslationStage.IDLE);
      }
    };
    
    recognitionRef.current = recognitionInstance;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort(); 
      }
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      clearCopySuccessMessage();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceLanguage, targetLanguage, handleTranslation]);


  const handleRecordToggle = () => {
    if (!recognitionRef.current || !isBrowserSupported) {
      setError(isBrowserSupported ? "Speech recognition is not initialized." : "Speech recognition is not supported by your browser.");
      setStage(TranslationStage.ERROR);
      return;
    }
    if (stage === TranslationStage.RECORDING) {
      recognitionRef.current.stop();
    } else {
      setOriginalText('');
      setTranslatedText('');
      setError(null);
      clearCopySuccessMessage();
      if (speechSynthesis.speaking) speechSynthesis.cancel(); 
      try {
        recognitionRef.current.lang = sourceLanguage; 
        recognitionRef.current.start();
      } catch (e: any) {
        console.error("Error starting recognition:", e);
        if (e.name === 'InvalidStateError') {
          setError("Speech recognition is already active. Please stop the current recording or wait.");
        } else {
          setError("Could not start recording. Please check microphone permissions or try again.");
        }
        setStage(TranslationStage.ERROR);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setOriginalText('');
    setTranslatedText('');
    setStage(TranslationStage.IDLE);
    clearCopySuccessMessage();
    if (speechSynthesis) speechSynthesis.cancel();
    if (recognitionRef.current && (stageRef.current === TranslationStage.RECORDING || stageRef.current === TranslationStage.TRANSLATING)) {
        recognitionRef.current.abort();
    }
  };

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setOriginalText('');
    setTranslatedText('');
    setError(null);
    setStage(TranslationStage.IDLE);
    clearCopySuccessMessage();
    if (speechSynthesis) speechSynthesis.cancel();
    if (recognitionRef.current && stageRef.current === TranslationStage.RECORDING) {
        recognitionRef.current.abort();
    }
  };

  const handleManualTranslate = () => {
    if (originalText.trim()) {
      if (speechSynthesis.speaking) speechSynthesis.cancel(); 
      handleTranslation(originalText, sourceLanguage, targetLanguage);
    } else {
      setError("Please enter some text to translate.");
      setTranslatedText(''); 
    }
  };

  const handleCopyToClipboard = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      triggerCopySuccessMessage();
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setError('Failed to copy text to clipboard.');
    }
  };

  const handleShare = async () => {
    if (!translatedText || !IS_SHARE_SUPPORTED) return;
    try {
      await navigator.share({
        title: 'Translated Text',
        text: translatedText,
      });
    } catch (err) {
      console.error('Failed to share text: ', err);
    }
  };
  
  const isBusy = stage === TranslationStage.RECORDING || stage === TranslationStage.TRANSLATING || stage === TranslationStage.SPEAKING;


  if (!isBrowserSupported && stage === TranslationStage.ERROR && !error?.includes("Web Speech API")) {
    setError("Your browser does not support the Web Speech API, which is required for this application to function fully.");
  }


  if (stage === TranslationStage.ERROR && error && error.includes("Web Speech API")) { 
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: 'var(--app-background)', color: 'var(--app-text-primary)'}}>
        <div className="p-8 rounded-xl shadow-2xl text-center max-w-lg" style={{ backgroundColor: 'var(--card-background)', color: 'var(--card-text-primary)', boxShadow: 'var(--card-shadow)'}}>
            <img src={BRAND_INFO.logoTitle} alt={`${BRAND_INFO.organizationShortName} Logo`} className="h-10 mx-auto mb-4" style={{ filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }} />
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{color: 'var(--app-text-primary)'}}>TravelTalk</h1>
            <p className="text-md sm:text-lg mb-6" style={{ color: 'var(--app-text-secondary)'}}>Real-time voice translation for travelers</p>
            <p className="text-lg" style={{ color: 'var(--error-text)'}}>{error}</p>
            <p className="mt-4" style={{ color: 'var(--card-text-secondary)'}}>Please use a modern browser like Chrome or Firefox that supports the Web Speech API.</p>
        </div>
      </div>
    );
  }

  const getStatusMessage = () => {
    switch (stage) {
      case TranslationStage.RECORDING: return "Listening...";
      case TranslationStage.TRANSLATING: return "Translating...";
      case TranslationStage.SPEAKING: return "Speaking...";
      default: return "";
    }
  };
  
  const isApiKeyConfigured = typeof process !== 'undefined' && process.env && process.env.API_KEY;

  const socialIcons: { [key: string]: React.FC<{className?: string; style?: React.CSSProperties}> } = {
    blog: BlogIcon,
    linkedin: LinkedInIcon,
    instagram: InstagramIcon,
    github: GitHubIcon,
    x: XIcon,
    youtube: YouTubeIcon,
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pt-8 md:pt-12" style={{ backgroundColor: 'var(--app-background)' }}>
      <div 
        className="p-4 sm:p-6 rounded-xl shadow-2xl space-y-6 w-full max-w-3xl min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-6rem)] flex flex-col" 
        style={{ backgroundColor: 'var(--card-background)', color: 'var(--card-text-primary)', boxShadow: 'var(--card-shadow)' }}
      >
        <div className="flex justify-end items-center w-full gap-2">
            <IconButton
                onClick={() => setIsAboutModalOpen(true)}
                icon={<InformationCircleIcon className="w-6 h-6" />}
                label="About this app"
                className="p-2 rounded-full hover:bg-[var(--button-secondary-hover-background)] transition-colors"
                style={{ color: 'var(--icon-color)' }}
            />
            <IconButton
                onClick={toggleTheme}
                icon={theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
                label={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                className="p-2 rounded-full hover:bg-[var(--button-secondary-hover-background)] transition-colors"
                style={{ color: 'var(--icon-color)' }}
            />
        </div>
        <header className="text-center mb-4">
          <a 
              href={BRAND_INFO.socialMedia.blog} // Or your main website URL
              title={BRAND_INFO.organizationLongName} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mb-4" // Added margin-bottom for spacing
          >
              <img src={BRAND_INFO.logoTitle} alt={`${BRAND_INFO.organizationShortName} Logo`} className="h-10 mx-auto" style={{ filter: theme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }} />
          </a>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{color: 'var(--app-text-primary)'}}>TravelTalk</h1>
          <p className="text-md sm:text-lg" style={{ color: 'var(--app-text-secondary)'}}>Real-time voice translation for travelers</p>
        </header>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <LanguageSelector
            label="Speak in:"
            languages={SUPPORTED_LANGUAGES}
            selectedLanguage={sourceLanguage}
            onChange={(lang) => { setSourceLanguage(lang); setOriginalText(''); setTranslatedText(''); setError(null); setStage(TranslationStage.IDLE); if (speechSynthesis.speaking) speechSynthesis.cancel(); clearCopySuccessMessage(); if(recognitionRef.current && stageRef.current === TranslationStage.RECORDING) recognitionRef.current.abort();}}
            disabled={isBusy}
          />
          <IconButton
            onClick={handleSwapLanguages}
            icon={<SwapIcon className="w-6 h-6"/>}
            label="Swap Languages"
            disabled={isBusy}
            className="p-3 rounded-full hover:bg-[var(--button-secondary-hover-background)] transition-colors"
            style={{color: 'var(--brand-primary)'}}
          />
          <LanguageSelector
            label="Translate to:"
            languages={SUPPORTED_LANGUAGES}
            selectedLanguage={targetLanguage}
            onChange={(lang) => { setTargetLanguage(lang); setTranslatedText(''); setError(null); setStage(TranslationStage.IDLE); if (speechSynthesis.speaking) speechSynthesis.cancel(); clearCopySuccessMessage();}}
            disabled={isBusy}
          />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 my-4">
          <IconButton
            onClick={handleRecordToggle}
            icon={stage === TranslationStage.RECORDING ? <StopCircleIcon className="w-10 h-10 sm:w-12 sm:h-12" /> : <MicrophoneIcon className="w-10 h-10 sm:w-12 sm:h-12" />}
            label={stage === TranslationStage.RECORDING ? "Stop Recording" : "Start Recording"}
            showLabel // Explicitly show label for this main action button
            disabled={!isBrowserSupported || (stage !== TranslationStage.IDLE && stage !== TranslationStage.RECORDING && stage !== TranslationStage.ERROR)}
            className={`p-4 sm:p-6 text-lg font-semibold rounded-full transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50
              ${stage === TranslationStage.RECORDING ? 'animate-pulse' : ''}
              disabled:opacity-[var(--button-disabled-opacity)] disabled:cursor-not-allowed disabled:hover:scale-100 disabled:animate-none`}
            style={{
                backgroundColor: stage === TranslationStage.RECORDING ? 'var(--error-background)' : 'var(--button-primary-background)',
                color: stage === TranslationStage.RECORDING ? 'var(--button-text-on-error)' : 'var(--button-text-on-primary)',
                '--focus-ring-color': stage === TranslationStage.RECORDING ? 'var(--error-focus-ring)' : 'var(--button-primary-focus-ring)'
            }}
          />
          <div className="h-6"> {/* Placeholder for status message or error */}
            {isBusy && !error && <span className="text-sm italic" style={{color: 'var(--app-text-secondary)'}}>{getStatusMessage()}</span>}
            {stage === TranslationStage.ERROR && error && <p className="text-sm" style={{color: 'var(--error-text)'}}>{error}</p>}
            {!isApiKeyConfigured && (stage === TranslationStage.IDLE || stage === TranslationStage.ERROR) && !error?.includes("Web Speech API") && (
                <p className="text-sm text-center max-w-md" style={{ color: 'var(--warning-text)', backgroundColor: 'var(--warning-background)', padding: '0.5rem 1rem', borderRadius: '0.375rem' }}>
                    Warning: API_KEY for Gemini is not configured. Translation functionality will be disabled. Please refer to deployment instructions to set up the API_KEY.
                </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
          <div className="flex flex-col">
            <label htmlFor="original-text" className="text-sm font-medium mb-1" style={{color: 'var(--app-text-secondary)'}}>
              You said ({SUPPORTED_LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage}):
            </label>
            <textarea
              id="original-text"
              value={originalText}
              onChange={(e) => {
                setOriginalText(e.target.value);
                if (!e.target.value.trim()) { // If textarea is cleared, also clear translation
                    setTranslatedText('');
                    setError(null);
                    setStage(TranslationStage.IDLE);
                    if(speechSynthesis.speaking) speechSynthesis.cancel();
                }
              }}
              placeholder="Text to translate will appear here..."
              className="w-full flex-grow p-3 rounded-md shadow-sm border focus:ring-2 focus:ring-opacity-75 disabled:bg-opacity-75 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border-color)',
                minHeight: '100px',
                opacity: isBusy || stage === TranslationStage.ERROR ? 'var(--input-disabled-opacity)' : 1
              }}
              disabled={isBusy || stage === TranslationStage.ERROR}
              rows={4}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="translated-text" className="text-sm font-medium mb-1" style={{color: 'var(--app-text-secondary)'}}>
              Translation ({SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage}):
            </label>
            <textarea
              id="translated-text"
              value={translatedText}
              readOnly
              placeholder="Translated text will appear here..."
              className="w-full flex-grow p-3 rounded-md shadow-sm border focus:ring-2 focus:ring-opacity-75 disabled:bg-opacity-75 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--input-background)',
                color: 'var(--input-text)',
                borderColor: 'var(--input-border-color)',
                minHeight: '100px',
                opacity: isBusy || stage === TranslationStage.ERROR ? 'var(--input-disabled-opacity)' : 1
              }}
              disabled={isBusy || stage === TranslationStage.ERROR}
              rows={4}
              aria-live="polite"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto pt-4">
          <div className="flex items-center gap-2">
            <IconButton
              onClick={handleManualTranslate}
              icon={stage === TranslationStage.TRANSLATING ? <Spinner /> : <PaperAirplaneIcon className="w-5 h-5"/>}
              label={stage === TranslationStage.TRANSLATING ? "Translating..." : "Translate Text"}
              disabled={isBusy || !originalText.trim() || stage === TranslationStage.ERROR}
              className="p-2 rounded-md text-sm font-medium hover:bg-[var(--button-secondary-hover-background)]"
              style={{ backgroundColor: 'var(--button-secondary-background)', color: 'var(--button-secondary-text)', '--focus-ring-color': 'var(--button-secondary-focus-ring)'}}
              showLabel
            />
             {stage === TranslationStage.ERROR && (
               <IconButton
                onClick={handleRetry}
                icon={<ArrowPathIcon className="w-5 h-5"/>}
                label="Retry"
                className="p-2 rounded-md text-sm font-medium hover:bg-[var(--button-secondary-hover-background)]"
                style={{ backgroundColor: 'var(--button-secondary-background)', color: 'var(--button-secondary-text)', '--focus-ring-color': 'var(--button-secondary-focus-ring)'}}
                showLabel
              />
             )}
          </div>
          <div className="flex items-center gap-2">
            {translatedText && stage !== TranslationStage.TRANSLATING && stage !== TranslationStage.RECORDING && stage !== TranslationStage.ERROR && (
              <IconButton
                onClick={() => speakText(translatedText, targetLanguage)}
                icon={<SpeakerWaveIcon className="w-5 h-5"/>}
                label="Speak Translation"
                disabled={stage === TranslationStage.SPEAKING}
                className="p-2 rounded-md hover:bg-[var(--button-secondary-hover-background)]"
                style={{ backgroundColor: 'var(--button-secondary-background)', color: 'var(--button-secondary-text)', '--focus-ring-color': 'var(--button-secondary-focus-ring)'}}
              />
            )}
            {translatedText && !showCopySuccess && (
                <IconButton
                    onClick={handleCopyToClipboard}
                    icon={<CopyIcon className="w-5 h-5"/>}
                    label="Copy Translation"
                    className="p-2 rounded-md hover:bg-[var(--button-secondary-hover-background)]"
                    style={{ backgroundColor: 'var(--button-secondary-background)', color: 'var(--button-secondary-text)', '--focus-ring-color': 'var(--button-secondary-focus-ring)'}}
                />
            )}
            {showCopySuccess && (
                <div 
                    className="flex items-center p-2 rounded-md"
                    style={{ backgroundColor: 'var(--success-background)', color: 'var(--success-text)' }}
                >
                    <CheckCircleIcon className="w-5 h-5 mr-1" />
                    <span className="text-sm">Copied!</span>
                </div>
            )}
            {IS_SHARE_SUPPORTED && translatedText && (
              <IconButton
                onClick={handleShare}
                icon={<ShareActionIcon className="w-5 h-5"/>}
                label="Share Translation"
                className="p-2 rounded-md hover:bg-[var(--button-secondary-hover-background)]"
                style={{ backgroundColor: 'var(--button-secondary-background)', color: 'var(--button-secondary-text)', '--focus-ring-color': 'var(--button-secondary-focus-ring)'}}
              />
            )}
          </div>
        </div>
        
        <footer className="text-center pt-6 mt-auto border-t" style={{ borderColor: 'var(--separator-color)' }}>
            
            <p className="text-xs mb-2" style={{ color: 'var(--app-text-tertiary)' }}>
                {BRAND_INFO.slogan}. Developed by {BRAND_INFO.developer}.
            </p>
            <div className="flex justify-center space-x-4 mb-3">
                {Object.entries(BRAND_INFO.socialMedia).map(([platform, url]) => {
                    const IconComponent = socialIcons[platform as keyof typeof BRAND_INFO.socialMedia];
                    return IconComponent ? (
                        <a 
                            key={platform} 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            title={`${BRAND_INFO.organizationShortName} on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                            className="inline-block p-1 rounded-full hover:bg-[var(--button-secondary-hover-background)] transition-colors"
                            aria-label={`${BRAND_INFO.organizationShortName} on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                        >
                            <IconComponent className="w-5 h-5" style={{ color: 'var(--icon-color-secondary)' }} />
                        </a>
                    ) : null;
                })}
            </div>
            <p className="text-xs" style={{ color: 'var(--app-text-tertiary)' }}>
                &copy; {currentYear} {BRAND_INFO.organizationShortName}. All rights reserved.
            </p>
        </footer>

      </div>
      {/* Render AboutModal here so it can overlay everything */}
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
    </div>
  );
};

export default App;
