import { useState, useEffect, useId, useCallback } from 'react';
import { CaseData, storageService } from '../services/storageService';
import Button from '../components/Button';
import LiveRegion from '../components/LiveRegion';
import { useAnnounce } from '../hooks/useAnnounce';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

/**
 * StammdatenPage - Seite für die Verwaltung der Stammdaten
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Struktur mit korrekter Überschriften-Hierarchie
 * - 2.4.6: Beschreibende Überschriften und Labels
 * - 3.3.2: Labels und Anweisungen für alle Formularfelder
 * - 4.1.3: Status-Nachrichten werden angekündigt
 */
export default function StammdatenPage() {
  const formId = useId();
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [formData, setFormData] = useState<Partial<CaseData>>({});
  const { message: announcement, announce } = useAnnounce();

  useEffect(() => {
    // Seitentitel setzen
    document.title = 'Stammdaten - Vermögensteuer-Dashboard';
    
    storageService.initMockData();
    const data = storageService.getCase();
    setCaseData(data);
    setFormData(data || {});
  }, []);

  const handleNestedChange = useCallback((section: string, field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof CaseData] as object),
        [field]: value,
      },
    }));
  }, []);

  const handleSave = useCallback(() => {
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
      announce('Stammdaten wurden erfolgreich gespeichert');
    }
  }, [caseData, formData, announce]);

  const inputClasses = "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm";

  if (!caseData) {
    return (
      <div className="p-4" role="status" aria-busy="true">
        <span className="sr-only">Stammdaten werden geladen</span>
        Lade...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Live-Region für Status-Ankündigungen */}
      <LiveRegion message={announcement} />

      {/* Seiten-Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Stammdaten
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Verwalten Sie hier die grundlegenden Daten zur steuerpflichtigen Person und den Veranlagungsparametern.
        </p>
      </div>

      <form 
        id={formId}
        onSubmit={(e) => { e.preventDefault(); handleSave(); }}
        noValidate
      >
        {/* Abschnitt 1: Steuerpflichtige Person */}
        <section className="space-y-4 mb-8" aria-labelledby="section-person">
          <h2 
            id="section-person" 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            1. Steuerpflichtige Person / Einheit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor={`${formId}-name`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Name <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(Pflichtfeld)</span>
              </label>
              <input
                id={`${formId}-name`}
                type="text"
                value={formData.steuerpflichtigePerson?.name || ''}
                onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'name', e.target.value)}
                className={inputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label 
                htmlFor={`${formId}-geburtsdatum`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Geburtsdatum
              </label>
              <input
                id={`${formId}-geburtsdatum`}
                type="date"
                value={formData.steuerpflichtigePerson?.geburtsdatum || ''}
                onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'geburtsdatum', e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label 
                htmlFor={`${formId}-steuerId`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Steuer-ID <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(Pflichtfeld)</span>
              </label>
              <input
                id={`${formId}-steuerId`}
                type="text"
                value={formData.steuerpflichtigePerson?.steuerId || ''}
                onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'steuerId', e.target.value)}
                className={inputClasses}
                aria-required="true"
                aria-describedby={`${formId}-steuerId-hint`}
              />
              <p id={`${formId}-steuerId-hint`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                11-stellige Steueridentifikationsnummer
              </p>
            </div>
            <div>
              <label 
                htmlFor={`${formId}-anschrift`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Anschrift
              </label>
              <input
                id={`${formId}-anschrift`}
                type="text"
                value={formData.steuerpflichtigePerson?.anschrift || ''}
                onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'anschrift', e.target.value)}
                className={inputClasses}
              />
            </div>
            <div>
              <label 
                htmlFor={`${formId}-rechtsform`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Rechtsform
              </label>
              <input
                id={`${formId}-rechtsform`}
                type="text"
                value={formData.steuerpflichtigePerson?.rechtsform || ''}
                onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'rechtsform', e.target.value)}
                className={inputClasses}
                placeholder="z.B. GmbH, AG, Einzelperson"
              />
            </div>
            <div>
              <label 
                htmlFor={`${formId}-registernummer`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Registernummer
              </label>
              <input
                id={`${formId}-registernummer`}
                type="text"
                value={formData.steuerpflichtigePerson?.registernummer || ''}
                onChange={(e) => handleNestedChange('steuerpflichtigePerson', 'registernummer', e.target.value)}
                className={inputClasses}
                placeholder="z.B. HRB 12345"
              />
            </div>
          </div>
        </section>

        {/* Abschnitt 2: Veranlagungsparameter */}
        <section className="space-y-4 mb-8" aria-labelledby="section-veranlagung">
          <h2 
            id="section-veranlagung" 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            2. Veranlagungsparameter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor={`${formId}-bewertungsstichtag`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bewertungsstichtag <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(Pflichtfeld)</span>
              </label>
              <input
                id={`${formId}-bewertungsstichtag`}
                type="date"
                value={formData.veranlagungsparameter?.bewertungsstichtag || ''}
                onChange={(e) => handleNestedChange('veranlagungsparameter', 'bewertungsstichtag', e.target.value)}
                className={inputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label 
                htmlFor={`${formId}-bewertungswaehrung`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bewertungswährung <span className="text-red-500" aria-hidden="true">*</span>
                <span className="sr-only">(Pflichtfeld)</span>
              </label>
              <select
                id={`${formId}-bewertungswaehrung`}
                value={formData.veranlagungsparameter?.bewertungswaehrung || 'EUR'}
                onChange={(e) => handleNestedChange('veranlagungsparameter', 'bewertungswaehrung', e.target.value)}
                className={inputClasses}
                aria-required="true"
              >
                <option value="EUR">EUR - Euro</option>
                <option value="USD">USD - US-Dollar</option>
              </select>
            </div>
            <div>
              <label 
                htmlFor={`${formId}-steuerdomizil`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Steuerdomizil
              </label>
              <input
                id={`${formId}-steuerdomizil`}
                type="text"
                value={formData.veranlagungsparameter?.steuerdomizil || ''}
                onChange={(e) => handleNestedChange('veranlagungsparameter', 'steuerdomizil', e.target.value)}
                className={inputClasses}
                placeholder="z.B. Deutschland"
              />
            </div>
          </div>
        </section>

        {/* Abschnitt 3: Erklärungs- und Nachweisangaben */}
        <section className="space-y-4 mb-8" aria-labelledby="section-erklaerung">
          <h2 
            id="section-erklaerung" 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            3. Erklärungs- und Nachweisangaben
          </h2>
          
          <fieldset>
            <legend className="sr-only">Erklärungen und Einwilligungen</legend>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <input
                  id={`${formId}-vollstaendigkeit`}
                  type="checkbox"
                  checked={formData.erklarungsangaben?.vollstaendigkeit || false}
                  onChange={(e) => handleNestedChange('erklarungsangaben', 'vollstaendigkeit', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600"
                />
                <label 
                  htmlFor={`${formId}-vollstaendigkeit`}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Vollständigkeitserklärung
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Ich bestätige, dass alle Angaben vollständig und wahrheitsgemäß sind.
                  </span>
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  id={`${formId}-mitwirkungspflichten`}
                  type="checkbox"
                  checked={formData.erklarungsangaben?.mitwirkungspflichten || false}
                  onChange={(e) => handleNestedChange('erklarungsangaben', 'mitwirkungspflichten', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-600"
                />
                <label 
                  htmlFor={`${formId}-mitwirkungspflichten`}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Mitwirkungspflichten erfüllt
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Die Mitwirkungspflichten gemäß § 90 AO wurden erfüllt.
                  </span>
                </label>
              </div>
              
              <div className="flex items-start gap-3">
                <input
                  id={`${formId}-datenverarbeitung`}
                  type="checkbox"
                  checked={formData.erklarungsangaben?.datenverarbeitung || false}
                  onChange={(e) => handleNestedChange('erklarungsangaben', 'datenverarbeitung', e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-600"
                />
                <label 
                  htmlFor={`${formId}-datenverarbeitung`}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Einwilligung Datenverarbeitung
                  <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Ich stimme der Verarbeitung meiner Daten gemäß DSGVO zu.
                  </span>
                </label>
              </div>
            </div>
          </fieldset>
          
          <div className="mt-4 space-y-4">
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Identitätsnachweis
              </span>
              <Button 
                variant="secondary" 
                onClick={() => announce('Dateiauswahl für Identitätsnachweis geöffnet')}
                type="button"
                aria-describedby={`${formId}-identitaet-hint`}
              >
                <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
                Datei auswählen
              </Button>
              <p id={`${formId}-identitaet-hint`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Akzeptierte Formate: PDF, JPG, PNG (max. 10 MB)
              </p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Vollmacht
              </span>
              <Button 
                variant="secondary" 
                onClick={() => announce('Dateiauswahl für Vollmacht geöffnet')}
                type="button"
                aria-describedby={`${formId}-vollmacht-hint`}
              >
                <ArrowUpTrayIcon className="h-4 w-4" aria-hidden="true" />
                Datei auswählen
              </Button>
              <p id={`${formId}-vollmacht-hint`} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Erforderlich bei Vertretung durch Dritte
              </p>
            </div>
          </div>
        </section>

        {/* Abschnitt 4: Adressierung / Kommunikation */}
        <section className="space-y-4 mb-8" aria-labelledby="section-kommunikation">
          <h2 
            id="section-kommunikation" 
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
          >
            4. Adressierung / Kommunikation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor={`${formId}-zustelladresse`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Zustelladresse
              </label>
              <textarea
                id={`${formId}-zustelladresse`}
                value={formData.kommunikation?.zustelladresse || ''}
                onChange={(e) => handleNestedChange('kommunikation', 'zustelladresse', e.target.value)}
                rows={3}
                className={inputClasses}
                placeholder="Straße, Hausnummer&#10;PLZ Ort&#10;Land"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor={`${formId}-email`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  E-Mail
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  value={formData.kommunikation?.email || ''}
                  onChange={(e) => handleNestedChange('kommunikation', 'email', e.target.value)}
                  className={inputClasses}
                  autoComplete="email"
                />
              </div>
              <div>
                <label 
                  htmlFor={`${formId}-telefon`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Telefon
                </label>
                <input
                  id={`${formId}-telefon`}
                  type="tel"
                  value={formData.kommunikation?.telefon || ''}
                  onChange={(e) => handleNestedChange('kommunikation', 'telefon', e.target.value)}
                  className={inputClasses}
                  autoComplete="tel"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Aktions-Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="secondary" 
            onClick={() => {
              setFormData(caseData || {});
              announce('Änderungen wurden verworfen');
            }}
            type="button"
          >
            Abbrechen
          </Button>
          <Button variant="primary" type="submit">
            Speichern
          </Button>
        </div>
      </form>
    </div>
  );
}
