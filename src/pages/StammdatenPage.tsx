import { useState, useEffect } from 'react';
import { CaseData, storageService } from '../services/storageService';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function StammdatenPage() {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [formData, setFormData] = useState<Partial<CaseData>>({});

  useEffect(() => {
    storageService.initMockData();
    const data = storageService.getCase();
    setCaseData(data);
    setFormData(data || {});
  }, []);

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof CaseData] as object),
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (caseData) {
      const updated: CaseData = {
        ...caseData,
        ...formData,
        steuerpflichtigePerson: {
          ...caseData.steuerpflichtigePerson,
          ...(formData.steuerpflichtigePerson as object),
        },
        veranlagungsparameter: {
          ...caseData.veranlagungsparameter,
          ...(formData.veranlagungsparameter as object),
        },
        erklarungsangaben: {
          ...caseData.erklarungsangaben,
          ...(formData.erklarungsangaben as object),
        },
        kommunikation: {
          ...caseData.kommunikation,
          ...(formData.kommunikation as object),
        },
      };
      storageService.saveCase(updated);
      setCaseData(updated);
      alert('Daten gespeichert');
    }
  };

  if (!caseData) {
    return <div className="p-4">Lade...</div>;
  }

  const stammdatenContent = (
    <div className="max-w-4xl space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          1. Steuerpflichtige Person / Einheit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.steuerpflichtigePerson?.name || ''}
              onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Geburtsdatum
            </label>
            <input
              type="date"
              value={formData.steuerpflichtigePerson?.geburtsdatum || ''}
              onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'geburtsdatum', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Steuer-ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.steuerpflichtigePerson?.steuerId || ''}
              onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'steuerId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Anschrift
            </label>
            <input
              type="text"
              value={formData.steuerpflichtigePerson?.anschrift || ''}
              onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'anschrift', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rechtsform
            </label>
            <input
              type="text"
              value={formData.steuerpflichtigePerson?.rechtsform || ''}
              onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'rechtsform', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Registernummer
            </label>
            <input
              type="text"
              value={formData.steuerpflichtigePerson?.registernummer || ''}
              onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'registernummer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          2. Veranlagungsparameter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bewertungsstichtag <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.veranlagungsparameter?.bewertungsstichtag || ''}
              onChange={(e) => handleNestedChange('veranlagungsparameter', 'bewertungsstichtag', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bewertungswährung <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.veranlagungsparameter?.bewertungswaehrung || 'EUR'}
              onChange={(e) => handleNestedChange('veranlagungsparameter', 'bewertungswaehrung', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Steuerdomizil
            </label>
            <input
              type="text"
              value={formData.veranlagungsparameter?.steuerdomizil || ''}
              onChange={(e) => handleNestedChange('veranlagungsparameter', 'steuerdomizil', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          3. Erklärungs- und Nachweisangaben
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.erklarungsangaben?.vollstaendigkeit || false}
              onChange={(e) => handleNestedChange('erklarungsangaben', 'vollstaendigkeit', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Vollständigkeitserklärung</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.erklarungsangaben?.mitwirkungspflichten || false}
              onChange={(e) => handleNestedChange('erklarungsangaben', 'mitwirkungspflichten', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mitwirkungspflichten erfüllt</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.erklarungsangaben?.datenverarbeitung || false}
              onChange={(e) => handleNestedChange('erklarungsangaben', 'datenverarbeitung', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Einwilligung Datenverarbeitung</span>
          </label>
        </div>
        <div className="mt-4 space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Identitätsnachweis
            </label>
            <Button variant="secondary" onClick={() => {}}>
              <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
              Datei auswählen
            </Button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Vollmacht
            </label>
            <Button variant="secondary" onClick={() => {}}>
              <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
              Datei auswählen
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          4. Adressierung / Kommunikation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Zustelladresse
            </label>
            <textarea
              value={formData.kommunikation?.zustelladresse || ''}
              onChange={(e) => handleNestedChange('kommunikation', 'zustelladresse', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                E-Mail
              </label>
              <input
                type="email"
                value={formData.kommunikation?.email || ''}
                onChange={(e) => handleNestedChange('kommunikation', 'email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.kommunikation?.telefon || ''}
                onChange={(e) => handleNestedChange('kommunikation', 'telefon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="secondary" onClick={() => {}}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Speichern
        </Button>
      </div>
    </div>
  );


  const dokumenteContent = (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Dokumente & Nachweise
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Keine Dokumente hochgeladen.</p>
          <Button variant="primary" onClick={() => {}} className="mt-4">
            <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
            Dokument hochladen
          </Button>
        </div>
      </div>
    </div>
  );

  const protokollContent = (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Änderungsprotokoll
        </h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Keine Einträge im Protokoll.</p>
          <p className="text-sm mt-2">Änderungen an den Stammdaten werden hier protokolliert.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Stammdaten</h1>
      
      <Tabs
        items={[
          {
            label: 'Stammdaten',
            content: stammdatenContent,
          },
          {
            label: 'Dokumente',
            content: dokumenteContent,
          },
          {
            label: 'Protokoll',
            content: protokollContent,
          },
        ]}
      />
    </div>
  );
}
