import { Fragment, useState, useEffect, useId, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SchuldPosition } from '../services/storageService';
import Button from './Button';
import LiveRegion from './LiveRegion';

interface SchuldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schuld: SchuldPosition) => void;
  onDelete?: (id: string) => void;
  schuld?: SchuldPosition;
}

interface FormErrors {
  glaeubiger?: string;
  rechtsgrund?: string;
  nennbetrag?: string;
}

/**
 * SchuldDialog-Komponente mit vollständiger Barrierefreiheit
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Formularstruktur
 * - 2.1.2: Keine Keyboard-Trap
 * - 2.4.3: Logische Fokus-Reihenfolge
 * - 3.3.1-3.3.4: Vollständige Fehlerbehandlung
 * - 4.1.3: Status-Nachrichten für Screenreader
 */
export default function SchuldDialog({ isOpen, onClose, onSave, onDelete, schuld }: SchuldDialogProps) {
  const formId = useId();
  const initialFocusRef = useRef<HTMLInputElement>(null);
  const [announcement, setAnnouncement] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<Partial<SchuldPosition>>({
    glaeubiger: '',
    rechtsgrund: '',
    nennbetrag: 0,
    faelligkeit: '',
    zinssatz: 0,
    besicherung: '',
  });

  useEffect(() => {
    if (schuld) {
      setFormData(schuld);
    } else {
      setFormData({
        glaeubiger: '',
        rechtsgrund: '',
        nennbetrag: 0,
        faelligkeit: '',
        zinssatz: 0,
        besicherung: '',
      });
    }
    setErrors({});
    setAnnouncement('');
  }, [schuld, isOpen]);

  const handleChange = useCallback((field: keyof SchuldPosition, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Fehler für dieses Feld löschen bei Änderung
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.glaeubiger?.trim()) {
      newErrors.glaeubiger = 'Gläubiger ist erforderlich';
    }
    
    if (!formData.rechtsgrund?.trim()) {
      newErrors.rechtsgrund = 'Rechtsgrund ist erforderlich';
    }
    
    if (!formData.nennbetrag || Number(formData.nennbetrag) <= 0) {
      newErrors.nennbetrag = 'Nennbetrag muss größer als 0 sein';
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
    
    const schuldToSave: SchuldPosition = {
      id: schuld?.id || `schuld-${Date.now()}`,
      glaeubiger: formData.glaeubiger || '',
      rechtsgrund: formData.rechtsgrund || '',
      nennbetrag: Number(formData.nennbetrag) || 0,
      faelligkeit: formData.faelligkeit,
      zinssatz: formData.zinssatz ? Number(formData.zinssatz) : undefined,
      besicherung: formData.besicherung,
    };
    
    onSave(schuldToSave);
    setAnnouncement(schuld ? 'Schuld wurde gespeichert' : 'Neue Schuld wurde hinzugefügt');
    onClose();
  };

  const handleDelete = () => {
    if (schuld && onDelete) {
      if (window.confirm('Möchten Sie diese Schuld wirklich löschen?')) {
        onDelete(schuld.id);
        setAnnouncement('Schuld wurde gelöscht');
        onClose();
      }
    }
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
                      {schuld ? 'Schuld bearbeiten' : 'Neue Schuld hinzufügen'}
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
                    Formular zum {schuld ? 'Bearbeiten einer' : 'Hinzufügen einer neuen'} Schuldenposition
                  </Dialog.Description>

                  <form id={formId} onSubmit={handleSubmit} className="px-6 py-4" noValidate>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Gläubiger */}
                        <div>
                          <label 
                            htmlFor={`${formId}-glaeubiger`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Gläubiger <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            ref={initialFocusRef}
                            id={`${formId}-glaeubiger`}
                            type="text"
                            value={formData.glaeubiger || ''}
                            onChange={(e) => handleChange('glaeubiger', e.target.value)}
                            placeholder="Name der Bank/Person"
                            className={inputClasses(!!errors.glaeubiger)}
                            aria-required="true"
                            aria-invalid={!!errors.glaeubiger}
                            aria-describedby={errors.glaeubiger ? `${formId}-glaeubiger-error` : undefined}
                          />
                          {errors.glaeubiger && (
                            <p id={`${formId}-glaeubiger-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.glaeubiger}
                            </p>
                          )}
                        </div>
                        
                        {/* Rechtsgrund */}
                        <div>
                          <label 
                            htmlFor={`${formId}-rechtsgrund`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Rechtsgrund <span className="text-red-500" aria-hidden="true">*</span>
                          </label>
                          <input
                            id={`${formId}-rechtsgrund`}
                            type="text"
                            value={formData.rechtsgrund || ''}
                            onChange={(e) => handleChange('rechtsgrund', e.target.value)}
                            placeholder="z.B. Darlehen, Kredit"
                            className={inputClasses(!!errors.rechtsgrund)}
                            aria-required="true"
                            aria-invalid={!!errors.rechtsgrund}
                            aria-describedby={errors.rechtsgrund ? `${formId}-rechtsgrund-error` : undefined}
                          />
                          {errors.rechtsgrund && (
                            <p id={`${formId}-rechtsgrund-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                              {errors.rechtsgrund}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Nennbetrag */}
                      <div>
                        <label 
                          htmlFor={`${formId}-nennbetrag`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Nennbetrag (€) <span className="text-red-500" aria-hidden="true">*</span>
                        </label>
                        <input
                          id={`${formId}-nennbetrag`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.nennbetrag || ''}
                          onChange={(e) => handleChange('nennbetrag', parseFloat(e.target.value))}
                          className={inputClasses(!!errors.nennbetrag)}
                          aria-required="true"
                          aria-invalid={!!errors.nennbetrag}
                          aria-describedby={errors.nennbetrag ? `${formId}-nennbetrag-error` : undefined}
                        />
                        {errors.nennbetrag && (
                          <p id={`${formId}-nennbetrag-error`} className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">
                            {errors.nennbetrag}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Fälligkeit */}
                        <div>
                          <label 
                            htmlFor={`${formId}-faelligkeit`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Fälligkeit
                          </label>
                          <input
                            id={`${formId}-faelligkeit`}
                            type="date"
                            value={formData.faelligkeit || ''}
                            onChange={(e) => handleChange('faelligkeit', e.target.value)}
                            className={inputClasses(false)}
                          />
                        </div>
                        
                        {/* Zinssatz */}
                        <div>
                          <label 
                            htmlFor={`${formId}-zinssatz`}
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Zinssatz (%)
                          </label>
                          <input
                            id={`${formId}-zinssatz`}
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.zinssatz || ''}
                            onChange={(e) => handleChange('zinssatz', parseFloat(e.target.value))}
                            className={inputClasses(false)}
                          />
                        </div>
                      </div>

                      {/* Besicherung */}
                      <div>
                        <label 
                          htmlFor={`${formId}-besicherung`}
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Besicherung
                        </label>
                        <textarea
                          id={`${formId}-besicherung`}
                          value={formData.besicherung || ''}
                          onChange={(e) => handleChange('besicherung', e.target.value)}
                          rows={3}
                          placeholder="z.B. Grundschuld, Bürgschaft"
                          className={inputClasses(false)}
                        />
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between gap-3">
                      <div>
                        {schuld && onDelete && (
                          <Button 
                            variant="secondary" 
                            onClick={handleDelete} 
                            type="button"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                            aria-label="Schuld löschen"
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
                          {schuld ? 'Speichern' : 'Hinzufügen'}
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
