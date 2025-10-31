import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { AssetPosition } from '../services/storageService';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (asset: AssetPosition) => void;
  category: string;
}

export default function AddAssetModal({ isOpen, onClose, onSave, category }: AddAssetModalProps) {
  const [formData, setFormData] = useState<Partial<AssetPosition>>({
    kategorie: category,
    bezeichnung: '',
    identifikator: '',
    menge: 1,
    einheitswert: 0,
    bewertungsmethode: '§ 11 BewG',
    kursdatum: new Date().toISOString().split('T')[0],
    quelle: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.bezeichnung || !formData.menge || !formData.einheitswert || !formData.kursdatum) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    const newAsset: AssetPosition = {
      id: `asset-${Date.now()}`,
      kategorie: formData.kategorie || category,
      bezeichnung: formData.bezeichnung,
      identifikator: formData.identifikator,
      menge: Number(formData.menge),
      einheitswert: Number(formData.einheitswert),
      positionswert: Number(formData.menge) * Number(formData.einheitswert),
      bewertungsmethode: formData.bewertungsmethode || '§ 11 BewG',
      kursdatum: formData.kursdatum,
      quelle: formData.quelle,
    };

    onSave(newAsset);
    setFormData({
      kategorie: category,
      bezeichnung: '',
      identifikator: '',
      menge: 1,
      einheitswert: 0,
      bewertungsmethode: '§ 11 BewG',
      kursdatum: new Date().toISOString().split('T')[0],
      quelle: '',
    });
    onClose();
  };

  const handleChange = (field: keyof AssetPosition, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neue Position hinzufügen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bezeichnung <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.bezeichnung || ''}
              onChange={(e) => handleChange('bezeichnung', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. Apple Inc. Aktie"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ISIN/WKN
            </label>
            <input
              type="text"
              value={formData.identifikator || ''}
              onChange={(e) => handleChange('identifikator', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. US0378331005"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kategorie
            </label>
            <select
              value={formData.kategorie || category}
              onChange={(e) => handleChange('kategorie', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            >
              <option value="Börsennotierte Wertpapiere">Börsennotierte Wertpapiere</option>
              <option value="Nicht börsennotierte Investmentanteile">Nicht börsennotierte Investmentanteile</option>
              <option value="Kapitalforderungen">Kapitalforderungen</option>
              <option value="Sonstige Finanzinstrumente">Sonstige Finanzinstrumente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stückzahl/Menge <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={formData.menge || ''}
              onChange={(e) => handleChange('menge', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Einheitswert (EUR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.einheitswert || ''}
              onChange={(e) => handleChange('einheitswert', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Kursdatum <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.kursdatum || ''}
              onChange={(e) => handleChange('kursdatum', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              required
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
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. Xetra, Bloomberg"
            />
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
              <option value="§ 11 BewG">§ 11 BewG</option>
              <option value="§ 9 BewG">§ 9 BewG (gemeiner Wert)</option>
            </select>
          </div>

          {formData.menge && formData.einheitswert && (
            <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="text-sm text-gray-500 dark:text-gray-400">Positionswert</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                  Number(formData.menge) * Number(formData.einheitswert)
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose} type="button">
            Abbrechen
          </Button>
          <Button variant="primary" type="submit">
            Position hinzufügen
          </Button>
        </div>
      </form>
    </Modal>
  );
}
