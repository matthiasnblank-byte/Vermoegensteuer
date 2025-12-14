import { Fragment, useState, useEffect, useId, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { AssetPosition } from '../services/storageService';
import Button from './Button';
import LiveRegion from './LiveRegion';

interface AssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: AssetPosition) => void;
  onDelete?: (id: string) => void;
  asset?: AssetPosition;
  kategorie: string;
}

interface FormErrors {
  identifikator?: string;
  bezeichnung?: string;
  menge?: string;
  einheitswert?: string;
  kursdatum?: string;
}

/**
 * AssetDialog-Komponente mit vollständiger Barrierefreiheit
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Formularstruktur
 * - 2.1.2: Keine Keyboard-Trap
 * - 2.4.3: Logische Fokus-Reihenfolge
 * - 3.3.1-3.3.4: Vollständige Fehlerbehandlung
 * - 4.1.3: Status-Nachrichten für Screenreader
 */
export default function AssetDialog({ isOpen, onClose, onSave, onDelete, asset, kategorie }: AssetDialogProps) {
  const formId = useId();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<Partial<AssetPosition>>({
    kategorie: kategorie,
    identifikator: '',
    bezeichnung: '',
    menge: 0,
    einheitswert: 0,
    positionswert: 0,
    bewertungsmethode: '§ 11 BewG',
    kursdatum: new Date().toISOString().split('T')[0],
    quelle: '',
  });

  useEffect(() => {
    if (asset) {
      setFormData(asset);
    } else {
      setFormData({
        kategorie: kategorie,
        identifikator: '',
        bezeichnung: '',
        menge: 0,
        einheitswert: 0,
        positionswert: 0,
        bewertungsmethode: '§ 11 BewG',
        kursdatum: new Date().toISOString().split('T')[0],
        quelle: '',
      });
    }
    setErrors({});
    setAnnouncement('');
  }, [asset, kategorie, isOpen]);

  const handleChange = useCallback((field: keyof AssetPosition, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Automatische Berechnung des Positionswerts
      if (field === 'menge' || field === 'einheitswert') {
        const menge = field === 'menge' ? (Number(value) || 0) : (Number(prev.menge) || 0);
        const einheitswert = field === 'einheitswert' ? (Number(value) || 0) : (Number(prev.einheitswert) || 0);
        updated.positionswert = menge * einheitswert;
      }
      
      return updated;
    });
    
    // Fehler für dieses Feld löschen bei Änderung
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!isIdentifikatorOptional() && !formData.identifikator?.trim()) {
      newErrors.identifikator = `${getIdentifikatorLabel()} ist erforderlich`;
    }
    
    if (!formData.bezeichnung?.trim()) {
      newErrors.bezeichnung = 'Bezeichnung ist erforderlich';
    }
    
    if (!formData.menge || Number(formData.menge) <= 0) {
      newErrors.menge = 'Stückzahl muss größer als 0 sein';
    }
    
    if (!formData.einheitswert || Number(formData.einheitswert) < 0) {
      newErrors.einheitswert = 'Einheitswert muss 0 oder größer sein';
    }
    
    if (!formData.kursdatum) {
      newErrors.kursdatum = 'Kursdatum ist erforderlich';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const errorCount = Object.keys(newErrors).length;
      setAnnouncement(`Formular enthält ${errorCount} Fehler. Bitte korrigieren Sie die markierten Felder.`);
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const menge = Number(formData.menge) || 0;
    const einheitswert = Number(formData.einheitswert) || 0;
    const positionswert = menge * einheitswert;
    
    const assetToSave: AssetPosition = {
      id: asset?.id || `asset-${Date.now()}`,
      kategorie: formData.kategorie || kategorie,
      identifikator: formData.identifikator || '',
      bezeichnung: formData.bezeichnung || '',
      menge: menge,
      einheitswert: einheitswert,
      positionswert: positionswert,
      bewertungsmethode: formData.bewertungsmethode || '§ 11 BewG',
      kursdatum: formData.kursdatum || new Date().toISOString().split('T')[0],
      quelle: formData.quelle,
    };
    
    onSave(assetToSave);
    setAnnouncement(asset ? 'Position wurde gespeichert' : 'Neue Position wurde hinzugefügt');
    onClose();
  };

  const handleDelete = () => {
    if (asset && onDelete) {
      if (window.confirm('Möchten Sie diese Position wirklich löschen?')) {
        onDelete(asset.id);
        setAnnouncement('Position wurde gelöscht');
        onClose();
      }
    }
  };

  const getIdentifikatorLabel = () => {
    const kat = formData.kategorie || kategorie;
    if (kat === 'Börsennotierte Wertpapiere' || kat === 'Nicht börsennotierte Investmentanteile') {
      return 'ISIN/WKN';
    } else if (kat === 'Kapitalforderungen') {
      return 'Kontonummer/IBAN';
    } else {
      return 'Identifikator';
    }
  };

  const isIdentifikatorOptional = () => {
    const kat = formData.kategorie || kategorie;
    return kat === 'Sonstige Finanzinstrumente';
  };

  const getPlaceholder = () => {
    const kat = formData.kategorie || kategorie;
    if (kat === 'Kapitalforderungen') return 'z.B. DE89 3704 0044 0532 0130 00';
    if (kat === 'Sonstige Finanzinstrumente') return 'z.B. Wallet-Adresse oder Ticker';
    return 'z.B. DE0005140008';
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-3 py-2 border rounded-md shadow-sm 
    bg-white dark:bg-gray-900 
    text-gray-900 dark:text-gray-100 
    focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 
    text-sm
    ${hasError 
      ? 'border-red-500 dark:border-red-400' 
      : 'border-gray-300 dark:border-gray-600'
    }
  `.replace(/\s+/g, ' ').trim();

  return (
    <>
      <LiveRegion message={announcement} />
      
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={onClose}
          initialFocus={initialFocusRef}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <Dialog.Title
                      as="h2"
                      className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                    >
                      {asset ? 'Position bearbeiten' : 'Neue Position hinzufügen'}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      onClick={onClose}
                    >
                      <span className="sr-only">Dialog schließen</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <Dialog.Description className="sr-only">
                    Formular zum {asset ? 'Bearbeiten einer' : 'Hinzufügen einer neuen'} Vermögensposition
                  </Dialog.Description>

                  <form id={formId} onSubmit={handleSubmit} className="px-6 py-4" noValidate>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Identifikator */}
                        <div>
                          <label 
                            htmlFor={`${formId}-identifikator`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            {getIdentifikatorLabel()}
                            {!isIdentifikatorOptional() && (
                              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                            )}
                          </label>
                          <input
                            ref={initialFocusRef}
                            id={`${formId}-identifikator`}
                            type="text"
                            value={formData.identifikator || ''}
                            onChange={(e) => handleChange('identifikator', e.target.value)}
                            placeholder={getPlaceholder()}
                            className={inputClasses(!!errors.identifikator)}
                            aria-required={!isIdentifikatorOptional()}
                            aria-invalid={!!errors.identifikator}
                            aria-describedby={errors.identifikator ? `${formId}-identifikator-error` : undefined}
                          />
                          {errors.identifikator && (
                            <p id={`${formId}-identifikator-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.identifikator}
                            </p>
                          )}
                        </div>
                        
                        {/* Bezeichnung */}
                        <div>
                          <label 
                            htmlFor={`${formId}-bezeichnung`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Bezeichnung <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id={`${formId}-bezeichnung`}
                            type="text"
                            value={formData.bezeichnung || ''}
                            onChange={(e) => handleChange('bezeichnung', e.target.value)}
                            className={inputClasses(!!errors.bezeichnung)}
                            aria-required="true"
                            aria-invalid={!!errors.bezeichnung}
                            aria-describedby={errors.bezeichnung ? `${formId}-bezeichnung-error` : undefined}
                          />
                          {errors.bezeichnung && (
                            <p id={`${formId}-bezeichnung-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.bezeichnung}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Stückzahl/Menge */}
                        <div>
                          <label 
                            htmlFor={`${formId}-menge`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Stückzahl/Menge <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id={`${formId}-menge`}
                            type="number"
                            step="0.001"
                            min="0"
                            value={formData.menge || ''}
                            onChange={(e) => handleChange('menge', e.target.value)}
                            className={inputClasses(!!errors.menge)}
                            aria-required="true"
                            aria-invalid={!!errors.menge}
                            aria-describedby={errors.menge ? `${formId}-menge-error` : undefined}
                          />
                          {errors.menge && (
                            <p id={`${formId}-menge-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.menge}
                            </p>
                          )}
                        </div>
                        
                        {/* Einheitswert */}
                        <div>
                          <label 
                            htmlFor={`${formId}-einheitswert`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Einheitswert (€) <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id={`${formId}-einheitswert`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.einheitswert || ''}
                            onChange={(e) => handleChange('einheitswert', e.target.value)}
                            className={inputClasses(!!errors.einheitswert)}
                            aria-required="true"
                            aria-invalid={!!errors.einheitswert}
                            aria-describedby={errors.einheitswert ? `${formId}-einheitswert-error` : undefined}
                          />
                          {errors.einheitswert && (
                            <p id={`${formId}-einheitswert-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.einheitswert}
                            </p>
                          )}
                        </div>
                        
                        {/* Positionswert (readonly) */}
                        <div>
                          <label 
                            htmlFor={`${formId}-positionswert`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Positionswert (€)
                          </label>
                          <input
                            id={`${formId}-positionswert`}
                            type="text"
                            value={new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(formData.positionswert || 0)}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                            aria-describedby={`${formId}-positionswert-hint`}
                          />
                          <p id={`${formId}-positionswert-hint`} className="sr-only">
                            Automatisch berechnet aus Stückzahl mal Einheitswert
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kursdatum */}
                        <div>
                          <label 
                            htmlFor={`${formId}-kursdatum`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Kursdatum <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id={`${formId}-kursdatum`}
                            type="date"
                            value={formData.kursdatum || ''}
                            onChange={(e) => handleChange('kursdatum', e.target.value)}
                            className={inputClasses(!!errors.kursdatum)}
                            aria-required="true"
                            aria-invalid={!!errors.kursdatum}
                            aria-describedby={errors.kursdatum ? `${formId}-kursdatum-error` : undefined}
                          />
                          {errors.kursdatum && (
                            <p id={`${formId}-kursdatum-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.kursdatum}
                            </p>
                          )}
                        </div>
                        
                        {/* Quelle */}
                        <div>
                          <label 
                            htmlFor={`${formId}-quelle`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Quelle
                          </label>
                          <input
                            id={`${formId}-quelle`}
                            type="text"
                            value={formData.quelle || ''}
                            onChange={(e) => handleChange('quelle', e.target.value)}
                            placeholder="z.B. Xetra, Bloomberg"
                            className={inputClasses(false)}
                          />
                        </div>
                      </div>

                      {/* Bewertungsmethode */}
                      <div>
                        <label 
                          htmlFor={`${formId}-bewertungsmethode`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Bewertungsmethode
                        </label>
                        <select
                          id={`${formId}-bewertungsmethode`}
                          value={formData.bewertungsmethode || '§ 11 BewG'}
                          onChange={(e) => handleChange('bewertungsmethode', e.target.value)}
                          className={inputClasses(false)}
                        >
                          <option value="§ 11 BewG">§ 11 BewG (Börsennotierte Wertpapiere)</option>
                          <option value="§ 9 BewG">§ 9 BewG (Gemeiner Wert)</option>
                          <option value="§ 12 BewG">§ 12 BewG (Kapitalforderungen)</option>
                        </select>
                      </div>

                      {/* Kategorie */}
                      <div>
                        <label 
                          htmlFor={`${formId}-kategorie`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Kategorie
                        </label>
                        <select
                          id={`${formId}-kategorie`}
                          value={formData.kategorie || kategorie}
                          onChange={(e) => handleChange('kategorie', e.target.value)}
                          className={inputClasses(false)}
                        >
                          <option value="Börsennotierte Wertpapiere">Börsennotierte Wertpapiere</option>
                          <option value="Nicht börsennotierte Investmentanteile">Nicht börsennotierte Investmentanteile</option>
                          <option value="Kapitalforderungen">Kapitalforderungen</option>
                          <option value="Sonstige Finanzinstrumente">Sonstige Finanzinstrumente</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between gap-3">
                      <div>
                        {asset && onDelete && (
                          <Button 
                            variant="secondary" 
                            onClick={handleDelete} 
                            type="button"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                            aria-label="Position löschen"
                          >
                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                            Löschen
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button variant="secondary" onClick={onClose} type="button">
                          Abbrechen
                        </Button>
                        <Button variant="primary" type="submit">
                          {asset ? 'Speichern' : 'Hinzufügen'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
