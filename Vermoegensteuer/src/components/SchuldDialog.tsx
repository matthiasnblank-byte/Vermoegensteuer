import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import { SchuldPosition } from '../services/storageService';
import Button from './Button';

interface SchuldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schuld: SchuldPosition) => void;
  onDelete?: (id: string) => void;
  schuld?: SchuldPosition;
}

export default function SchuldDialog({ isOpen, onClose, onSave, onDelete, schuld }: SchuldDialogProps) {
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
  }, [schuld, isOpen]);

  const handleChange = (field: keyof SchuldPosition, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    onClose();
  };

  const handleDelete = () => {
    if (schuld && onDelete) {
      if (window.confirm('Möchten Sie diese Schuld wirklich löschen?')) {
        onDelete(schuld.id);
        onClose();
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100"
                  >
                    {schuld ? 'Schuld bearbeiten' : 'Neue Schuld hinzufügen'}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    onClick={onClose}
                  >
                    <span className="sr-only">Schließen</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Gläubiger <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.glaeubiger || ''}
                          onChange={(e) => handleChange('glaeubiger', e.target.value)}
                          placeholder="Name der Bank/Person"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Rechtsgrund <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.rechtsgrund || ''}
                          onChange={(e) => handleChange('rechtsgrund', e.target.value)}
                          placeholder="z.B. Darlehen, Kredit"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nennbetrag (€) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        value={formData.nennbetrag || ''}
                        onChange={(e) => handleChange('nennbetrag', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Fälligkeit
                        </label>
                        <input
                          type="date"
                          value={formData.faelligkeit || ''}
                          onChange={(e) => handleChange('faelligkeit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Zinssatz (%)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.zinssatz || ''}
                          onChange={(e) => handleChange('zinssatz', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Besicherung
                      </label>
                      <textarea
                        value={formData.besicherung || ''}
                        onChange={(e) => handleChange('besicherung', e.target.value)}
                        rows={3}
                        placeholder="z.B. Grundschuld, Bürgschaft"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
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
  );
}

