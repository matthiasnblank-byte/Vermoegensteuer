import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { SchuldPosition } from '../services/storageService';

interface AddSchuldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schuld: SchuldPosition) => void;
}

export default function AddSchuldModal({ isOpen, onClose, onSave }: AddSchuldModalProps) {
  const [formData, setFormData] = useState<Partial<SchuldPosition>>({
    glaeubiger: '',
    rechtsgrund: '',
    nennbetrag: 0,
    faelligkeit: '',
    zinssatz: undefined,
    besicherung: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.glaeubiger || !formData.rechtsgrund || !formData.nennbetrag) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    const newSchuld: SchuldPosition = {
      id: `schuld-${Date.now()}`,
      glaeubiger: formData.glaeubiger,
      rechtsgrund: formData.rechtsgrund,
      nennbetrag: Number(formData.nennbetrag),
      faelligkeit: formData.faelligkeit || undefined,
      zinssatz: formData.zinssatz ? Number(formData.zinssatz) : undefined,
      besicherung: formData.besicherung || undefined,
    };

    onSave(newSchuld);
    setFormData({
      glaeubiger: '',
      rechtsgrund: '',
      nennbetrag: 0,
      faelligkeit: '',
      zinssatz: undefined,
      besicherung: '',
    });
    onClose();
  };

  const handleChange = (field: keyof SchuldPosition, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Neue Schuld hinzufügen">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Gläubiger <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.glaeubiger || ''}
              onChange={(e) => handleChange('glaeubiger', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. Sparkasse"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rechtsgrund <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.rechtsgrund || ''}
              onChange={(e) => handleChange('rechtsgrund', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. Darlehensvertrag"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nennbetrag (EUR) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.nennbetrag || ''}
              onChange={(e) => handleChange('nennbetrag', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              required
            />
          </div>

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
              min="0"
              max="100"
              step="0.01"
              value={formData.zinssatz || ''}
              onChange={(e) => handleChange('zinssatz', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. 2.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Besicherung
            </label>
            <input
              type="text"
              value={formData.besicherung || ''}
              onChange={(e) => handleChange('besicherung', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              placeholder="z.B. Grundschuld"
            />
          </div>

          <div className="md:col-span-2">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Hinweis:</strong> Schulden werden gem. ? 12 Abs. 1 BewG mit dem Nennwert bewertet.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose} type="button">
            Abbrechen
          </Button>
          <Button variant="primary" type="submit">
            Schuld hinzufügen
          </Button>
        </div>
      </form>
    </Modal>
  );
}
