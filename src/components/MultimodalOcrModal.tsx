import React, { useState, useRef, ChangeEvent } from 'react';
import { Camera, Upload, Sparkles, X, Check, FileText, Loader, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react';

interface MultimodalOcrModalProps {
  isOpen: boolean;
  isDarkMode?: boolean;
  accentColor?: string;
  onClose: () => void;
  onInsertDocumentHtml: (htmlContent: string) => void;
}

export default function MultimodalOcrModal({
  isOpen,
  isDarkMode = false,
  accentColor = '#1d4ed8',
  onClose,
  onInsertDocumentHtml,
}: MultimodalOcrModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedHtml, setExtractedHtml] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg(null);
    setExtractedHtml(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleProcessOcr = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const base64Data = selectedImage.split(',')[1] || selectedImage;
      const response = await fetch('/api/ai/ocr-to-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64Data,
          filename: fileName || 'scan_document.jpg',
        }),
      });

      const data = await response.json();
      if (data.success && data.content) {
        setExtractedHtml(data.content);
      } else {
        setErrorMsg("Impossible de numériser le document : " + (data.error || "Erreur de conversion"));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Erreur de connexion au service OCR ManixGPT.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-2xl rounded-3xl shadow-2xl border p-6 font-sans overflow-hidden transition-all ${
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
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Numérisation & OCR Multimodal IA</h3>
              <p className="text-xs text-slate-500">Convertissez des photos, scans de cours ou tableaux en documents Word éditables</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-4">
          {!selectedImage ? (
            /* Upload dropzone */
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-3xl text-center space-y-3 cursor-pointer transition hover:border-blue-500 ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold">Sélectionner ou déposer un scan / photo</p>
                <p className="text-xs text-slate-400">Formats acceptés : PNG, JPG, JPEG, WEBP</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            /* Preview & Process Area */
            <div className="grid grid-cols-2 gap-4">
              {/* Image Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Image / Scan Importé :</span>
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setExtractedHtml(null);
                    }}
                    className="text-red-500 hover:underline text-[10px] cursor-pointer"
                  >
                    Changer d'image
                  </button>
                </div>
                <div className="h-56 rounded-2xl border overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img src={selectedImage} alt="Scan preview" className="max-h-full max-w-full object-contain" />
                </div>
              </div>

              {/* Extraction Output */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-500">Rendu Document Word Extrait :</span>
                <div
                  className={`h-56 rounded-2xl border p-3 text-xs overflow-y-auto leading-relaxed font-serif ${
                    isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-2 text-center text-slate-400">
                      <Loader className="w-6 h-6 animate-spin text-blue-500" />
                      <p className="text-xs font-sans">Analyse OCR & Reconstitution de la mise en page...</p>
                    </div>
                  ) : extractedHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: extractedHtml }} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 font-sans text-xs">
                      <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-1" />
                      <p>Cliquez sur "Lancer l'OCR ManixGPT" pour convertir l'image en texte structuré.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Vision Multimodale : Reconstitution automatique des titres et tableaux
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Fermer
            </button>

            {selectedImage && !extractedHtml && (
              <button
                disabled={isLoading}
                onClick={handleProcessOcr}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center space-x-1.5 transition cursor-pointer hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Lancer l'OCR ManixGPT</span>
              </button>
            )}

            {extractedHtml && (
              <button
                onClick={() => {
                  onInsertDocumentHtml(extractedHtml);
                  onClose();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center space-x-1.5 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Insérer dans Manix Word</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
