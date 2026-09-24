import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Sparkles, X, Check, Volume2, Wand2, Pause, Play, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface VoiceDictationModalProps {
  isOpen: boolean;
  isDarkMode?: boolean;
  accentColor?: string;
  onClose: () => void;
  onInsertText: (formattedText: string) => void;
  onExecuteCommand?: (command: string) => void;
}

export default function VoiceDictationModal({
  isOpen,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onClose,
  onInsertText,
  onExecuteCommand,
}: VoiceDictationModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [cleanText, setCleanText] = useState('');
  const [detectedCommand, setDetectedCommand] = useState<string | null>(null);
  const [removedHesitationsCount, setRemovedHesitationsCount] = useState(0);
  const [interimResult, setInterimResult] = useState('');
  const recognitionRef = useRef<any>(null);

  // Initialize SpeechRecognition API
  useEffect(() => {
    if (!isOpen) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'fr-FR';

      rec.onresult = (event: any) => {
        let currentInterim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + ' ';
          } else {
            currentInterim += res[0].transcript;
          }
        }

        setInterimResult(currentInterim);

        if (finalChunk) {
          setTranscript((prev) => {
            const updated = prev + finalChunk;
            processTranscriptNLP(updated);
            return updated;
          });
        }
      };

      rec.onerror = (err: any) => {
        console.warn('Speech recognition error:', err);
      };

      rec.onend = () => {
        if (isListening) {
          try {
            rec.start();
          } catch {}
        }
      };

      recognitionRef.current = rec;
      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn("Speech Recognition standard API not available in window.");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
    };
  }, [isOpen]);

  // NLP Smart Filter for transcript cleaning and voice editing command detection
  const processTranscriptNLP = (rawText: string) => {
    let text = rawText;

    // 1. Count and remove hesitation filler words ("euh", "du coup", "en fait", "genre", "voilà")
    const hesitationRegex = /\b(euh|du coup|en fait|genre|voilà|hum|beuuh|bah)\b/gi;
    const matches = text.match(hesitationRegex);
    if (matches) {
      setRemovedHesitationsCount((c) => c + matches.length);
    }
    text = text.replace(hesitationRegex, '');

    // 2. Auto-punctuation replacements
    text = text
      .replace(/\b(point d'interrogation)\b/gi, ' ?')
      .replace(/\b(point d'exclamation)\b/gi, ' !')
      .replace(/\b(point virgule)\b/gi, ' ;')
      .replace(/\b(deux points)\b/gi, ' :')
      .replace(/\b(virgule)\b/gi, ',')
      .replace(/\b(point final|point)\b/gi, '.')
      .replace(/\b(à la ligne|nouveau paragraphe)\b/gi, '<br/><br/>')
      .replace(/\b(ouvrez les guillemets)\b/gi, '« ')
      .replace(/\b(fermez les guillemets)\b/gi, ' »');

    // 3. Voice Editing Commands Detection
    const lower = text.toLowerCase();
    if (lower.includes('met en gras') || lower.includes('mets en gras')) {
      setDetectedCommand('Action : Mettre le dernier texte en gras');
    } else if (lower.includes('souligne le titre') || lower.includes('souligne')) {
      setDetectedCommand('Action : Souligner le titre');
    } else if (lower.includes('nouveau titre') || lower.includes('titre principal')) {
      setDetectedCommand('Action : Créer un grand titre <h1>');
    } else {
      setDetectedCommand(null);
    }

    // Clean up double spaces and capitalize sentences
    let formatted = text.replace(/\s+/g, ' ').trim();
    formatted = formatted.replace(/(^\s*|[.!?]\s+)([a-zàâéèêëîïôöùûüç])/g, (m, p1, p2) => p1 + p2.toUpperCase());

    setCleanText(formatted);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-xl rounded-3xl shadow-2xl border p-6 font-sans overflow-hidden transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <Mic className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold">Dictée Vocale Intelligente IA</h3>
              <p className="text-xs text-slate-500">Reconnaissance vocale NLP avec suppression automatique des hésitations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer Animation */}
        <div className="py-6 text-center space-y-4">
          <div className="flex items-center justify-center space-x-1.5 h-12">
            {[12, 28, 45, 20, 36, 50, 24, 40, 16, 32, 48, 22].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-150 ${
                  isListening ? 'animate-bounce' : 'opacity-40'
                }`}
                style={{
                  height: isListening ? `${Math.max(8, (height * (i % 3 + 1)) % 48)}px` : '8px',
                  backgroundColor: accentColor,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Record Button */}
          <button
            onClick={toggleListening}
            className={`px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center space-x-2 mx-auto transition-all cursor-pointer ${
              isListening ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-500/20' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            style={!isListening ? { backgroundColor: accentColor } : {}}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>Mettre en pause la dictée</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>Reprendre l'écoute</span>
              </>
            )}
          </button>

          {/* Live NLP Metrics */}
          <div className="flex items-center justify-center space-x-4 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{removedHesitationsCount} hésitation(s) supprimée(s)</span>
            </span>
            {detectedCommand && (
              <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center space-x-1">
                <Wand2 className="w-3.5 h-3.5" />
                <span>{detectedCommand}</span>
              </span>
            )}
          </div>
        </div>

        {/* Live Transcript Display Box */}
        <div
          className={`p-4 rounded-2xl border min-h-[120px] max-h-[180px] overflow-y-auto font-serif text-sm leading-relaxed space-y-2 ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          {cleanText || interimResult ? (
            <div>
              <p className="text-slate-900 dark:text-slate-100">{cleanText}</p>
              {interimResult && <span className="text-slate-400 italic font-sans text-xs"> {interimResult}...</span>}
            </div>
          ) : (
            <p className="text-slate-400 italic text-xs text-center pt-8 font-sans">
              Parlez clairement dans votre micro... ManixGPT formate la ponctuation et nettoie le texte en temps réel.
            </p>
          )}
        </div>

        {/* Command Cheat-Sheet */}
        <div className="mt-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-[11px] text-slate-500 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
            <Volume2 className="w-3 h-3" />
            <span>Commandes vocales prises en charge :</span>
          </p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
            <span>• « Point », « Virgule », « À la ligne »</span>
            <span>• « Point d'interrogation »</span>
            <span>• « Met en gras », « Souligne le titre »</span>
            <span>• « Ouvrez les guillemets »</span>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-5 flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Annuler
          </button>
          <button
            disabled={!cleanText.trim()}
            onClick={() => {
              if (cleanText.trim()) {
                onInsertText(`<p>${cleanText}</p>`);
                onClose();
              }
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition cursor-pointer ${
              !cleanText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{ backgroundColor: accentColor }}
          >
            <Check className="w-4 h-4" />
            <span>Insérer le texte dicté</span>
          </button>
        </div>
      </div>
    </div>
  );
}
