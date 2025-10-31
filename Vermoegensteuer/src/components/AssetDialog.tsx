import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AssetPosition } from '../services/storageService';
import Button from './Button';

interface AssetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: AssetPosition) => void;
  asset?: AssetPosition;
  kategorie: string;
}

export default function AssetDialog({ isOpen, onClose, onSave, asset, kategorie }: AssetDialogProps) {
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
  }, [asset, kategorie, isOpen]);

  const handleChange = (field: keyof AssetPosition, value: string | number) => {
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    onClose();
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
                    {asset ? 'Position bearbeiten' : 'Neue Position hinzufügen'}
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
                          ISIN/WKN
                        </label>
                        <input
                          type="text"
                          value={formData.identifikator || ''}
                          onChange={(e) => handleChange('identifikator', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Bezeichnung <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.bezeichnung || ''}
                          onChange={(e) => handleChange('bezeichnung', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Stückzahl/Menge <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          step="0.001"
                          value={formData.menge || ''}
                          onChange={(e) => handleChange('menge', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Einheitswert (€) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          step="0.01"
                          value={formData.einheitswert || ''}
                          onChange={(e) => handleChange('einheitswert', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Positionswert (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.positionswert?.toFixed(2) || '0.00'}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Kursdatum <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.kursdatum || ''}
                          onChange={(e) => handleChange('kursdatum', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Quelle
                        </label>
                        <input
                          type="text"
                          value={formData.quelle || ''}
                          onChange={(e) => handleChange('quelle', e.target.value)}
                          placeholder="z.B. Xetra, Bloomberg"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bewertungsmethode
                      </label>
                      <select
                        value={formData.bewertungsmethode || '§ 11 BewG'}
                        onChange={(e) => handleChange('bewertungsmethode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                      >
                        <option value="§ 11 BewG">§ 11 BewG (Börsennotierte Wertpapiere)</option>
                        <option value="§ 9 BewG">§ 9 BewG (Gemeiner Wert)</option>
                        <option value="§ 12 BewG">§ 12 BewG (Kapitalforderungen)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Kategorie
                      </label>
                      <select
                        value={formData.kategorie || kategorie}
                        onChange={(e) => handleChange('kategorie', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
                      >
                        <option value="Börsennotierte Wertpapiere">Börsennotierte Wertpapiere</option>
                        <option value="Nicht börsennotierte Investmentanteile">Nicht börsennotierte Investmentanteile</option>
                        <option value="Kapitalforderungen">Kapitalforderungen</option>
                        <option value="Sonstige Finanzinstrumente">Sonstige Finanzinstrumente</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose} type="button">
                      Abbrechen
                    </Button>
                    <Button variant="primary" type="submit">
                      {asset ? 'Speichern' : 'Hinzufügen'}
                    </Button>
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

