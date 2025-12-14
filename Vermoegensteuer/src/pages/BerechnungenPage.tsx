import { useEffect, useState } from 'react';
import { storageService, AssetPosition, SchuldPosition } from '../services/storageService';
import {
  CalculatorIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/Button';
import LiveRegion from '../components/LiveRegion';
import { useAnnounce } from '../hooks/useAnnounce';
import VisuallyHidden from '../components/VisuallyHidden';

interface BerechnungErgebnis {
  gesamtvermoegen: number;
  gesamtschulden: number;
  reinvermoegen: number;
  freibetrag: number;
  steuerpflichtigesVermoegen: number;
  steuerbetrag: number;
  effektiverSteuersatz: number;
  bewertungsstichtag: string;
}

/**
 * BerechnungenPage - Seite für Vermögensteuerberechnungen
 * 
 * WCAG-Konformität:
 * - 1.3.1: Semantische Struktur
 * - 2.4.2: Seitentitel
 * - 4.1.3: Status-Nachrichten für Berechnungsergebnisse
 */
export default function BerechnungenPage() {
  const [assets, setAssets] = useState<AssetPosition[]>([]);
  const [schulden, setSchulden] = useState<SchuldPosition[]>([]);
  const [ergebnis, setErgebnis] = useState<BerechnungErgebnis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { message: announcement, announce } = useAnnounce();

  useEffect(() => {
    // Seitentitel setzen
    document.title = 'Berechnungen - Vermögensteuer-Dashboard';
    
    storageService.initMockData();
    setAssets(storageService.getAssets());
    setSchulden(storageService.getSchulden());
  }, []);

  const berechneVermoegensteuer = () => {
    setIsCalculating(true);
    announce('Berechnung wird durchgeführt...');

    setTimeout(() => {
      const gesamtvermoegen = assets.reduce((sum, asset) => sum + asset.positionswert, 0);
      const gesamtschulden = schulden.reduce((sum, schuld) => sum + schuld.nennbetrag, 0);
      const reinvermoegen = Math.max(0, gesamtvermoegen - gesamtschulden);
      const freibetrag = 1000000;
      const steuerpflichtigesVermoegen = Math.max(0, reinvermoegen - freibetrag);

      let steuerbetrag = 0;
      if (steuerpflichtigesVermoegen > 0) {
        if (steuerpflichtigesVermoegen <= 5000000) {
          steuerbetrag = steuerpflichtigesVermoegen * 0.01;
        } else if (steuerpflichtigesVermoegen <= 10000000) {
          steuerbetrag = 5000000 * 0.01 + (steuerpflichtigesVermoegen - 5000000) * 0.015;
        } else {
          steuerbetrag =
            5000000 * 0.01 +
            5000000 * 0.015 +
            (steuerpflichtigesVermoegen - 10000000) * 0.02;
        }
      }

      const effektiverSteuersatz = reinvermoegen > 0 ? (steuerbetrag / reinvermoegen) * 100 : 0;
      const caseData = storageService.getCase();
      const bewertungsstichtag =
        caseData?.veranlagungsparameter?.bewertungsstichtag || new Date().toISOString().split('T')[0];

      const result = {
        gesamtvermoegen,
        gesamtschulden,
        reinvermoegen,
        freibetrag,
        steuerpflichtigesVermoegen,
        steuerbetrag,
        effektiverSteuersatz,
        bewertungsstichtag,
      };

      setErgebnis(result);
      setIsCalculating(false);
      
      // Ankündigung des Ergebnisses für Screenreader
      announce(
        `Berechnung abgeschlossen. Vermögensteuer: ${formatCurrency(steuerbetrag)}. ` +
        `Effektiver Steuersatz: ${effektiverSteuersatz.toFixed(2)} Prozent.`
      );
    }, 600);
  };

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercent = (value: number): string =>
    new Intl.NumberFormat('de-DE', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);

  return (
    <div className="space-y-6">
      {/* Live-Region für Status-Ankündigungen */}
      <LiveRegion message={announcement} />

      {/* Seiten-Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Vermögensteuer-Berechnungen
        </h1>
        <Button
          variant="primary"
          onClick={berechneVermoegensteuer}
          disabled={isCalculating || assets.length === 0}
          loading={isCalculating}
          aria-describedby={assets.length === 0 ? 'no-assets-hint' : undefined}
        >
          <CalculatorIcon className="h-5 w-5" aria-hidden="true" />
          {isCalculating ? 'Berechne...' : 'Berechnung starten'}
        </Button>
      </div>

      {assets.length === 0 && (
        <p id="no-assets-hint" className="sr-only">
          Berechnung nicht möglich, da keine Vermögenspositionen vorhanden sind
        </p>
      )}

      {/* Hinweis-Box */}
      <aside 
        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        role="note"
        aria-label="Hinweis zur Modellrechnung"
      >
        <div className="flex items-start gap-3">
          <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Hinweis zur Modellrechnung</p>
            <p>
              In Deutschland ist die Vermögensteuer derzeit ausgesetzt. Diese Berechnung verwendet
              nachvollziehbare Modellannahmen (Freibetrag, progressive Sätze) und dient der
              Planung/Simulation.
            </p>
          </div>
        </div>
      </aside>

      {/* Berechnungsergebnis */}
      {ergebnis && (
        <div className="space-y-6" role="region" aria-label="Berechnungsergebnisse">
          <VisuallyHidden as="h2">Berechnungsergebnisse</VisuallyHidden>

          {/* Kennzahlen-Karten */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" role="list">
            <article 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              role="listitem"
              aria-labelledby="card-vermoegen-label"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
                </div>
                <h3 id="card-vermoegen-label" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gesamtvermögen
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.gesamtvermoegen)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {assets.length} Vermögenspositionen
              </p>
            </article>

            <article 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              role="listitem"
              aria-labelledby="card-schulden-label"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                </div>
                <h3 id="card-schulden-label" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gesamtschulden
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.gesamtschulden)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {schulden.length} Verbindlichkeiten
              </p>
            </article>

            <article 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              role="listitem"
              aria-labelledby="card-rein-label"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CurrencyEuroIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <h3 id="card-rein-label" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Reinvermögen
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.reinvermoegen)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Vermögen abzgl. Schulden
              </p>
            </article>

            <article 
              className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              role="listitem"
              aria-labelledby="card-steuer-label"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CalculatorIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                </div>
                <h3 id="card-steuer-label" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Steuerbetrag
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.steuerbetrag)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatPercent(ergebnis.effektiverSteuersatz)} eff. Steuersatz
              </p>
            </article>
          </div>

          {/* Detaillierte Berechnungsschritte */}
          <section 
            className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            aria-labelledby="details-heading"
          >
            <h2 id="details-heading" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Detaillierte Berechnungsschritte
            </h2>
            
            <ol className="space-y-4" aria-label="Berechnungsschritte">
              <li className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    1. Gesamtvermögen
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Summe aller Vermögenspositionen
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(ergebnis.gesamtvermoegen)}
                </p>
              </li>

              <li className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    2. Abzüglich Gesamtschulden
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Summe aller Verbindlichkeiten
                  </p>
                </div>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  − {formatCurrency(ergebnis.gesamtschulden)}
                </p>
              </li>

              <li className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      = Reinvermögen
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Bemessungsgrundlage vor Freibetrag (min. 0)
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(ergebnis.reinvermoegen)}
                  </p>
                </div>
              </li>

              <li className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    3. Abzüglich Freibetrag
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Modellannahme
                  </p>
                </div>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  − {formatCurrency(ergebnis.freibetrag)}
                </p>
              </li>

              <li className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      = Steuerpflichtiges Vermögen
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Bemessungsgrundlage für Tarif
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(ergebnis.steuerpflichtigesVermoegen)}
                  </p>
                </div>
              </li>

              <li className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  4. Anwendung des progressiven Steuertarifs
                </p>
                <dl className="space-y-2 pl-4">
                  <div className="flex justify-between text-xs">
                    <dt className="text-gray-600 dark:text-gray-400">Bis 5 Mio. EUR:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">1,0%</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-gray-600 dark:text-gray-400">5-10 Mio. EUR:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">1,5%</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-gray-600 dark:text-gray-400">Über 10 Mio. EUR:</dt>
                    <dd className="font-medium text-gray-900 dark:text-gray-100">2,0%</dd>
                  </div>
                </dl>
              </li>

              <li className="border-t-2 border-gray-300 dark:border-gray-600 pt-4">
                <div 
                  className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg"
                  role="region"
                  aria-label="Endergebnis der Berechnung"
                >
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Festzusetzende Vermögensteuer
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Stichtag: {new Date(ergebnis.bewertungsstichtag).toLocaleDateString('de-DE')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Effektiver Steuersatz: {formatPercent(ergebnis.effektiverSteuersatz)} vom Reinvermögen
                    </p>
                  </div>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                    {formatCurrency(ergebnis.steuerbetrag)}
                  </p>
                </div>
              </li>
            </ol>
          </section>
        </div>
      )}

      {/* Leerzustand */}
      {!ergebnis && !isCalculating && (
        <section 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12"
          aria-labelledby="empty-state-heading"
        >
          <div className="text-center">
            <CalculatorIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
            <h2 id="empty-state-heading" className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Keine Berechnung vorhanden
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Klicken Sie auf &quot;Berechnung starten&quot;, um eine Vermögensteuerberechnung basierend
              auf Ihren Stammdaten und Finanzanlagen durchzuführen.
            </p>
            {assets.length === 0 && (
              <p className="text-sm text-orange-600 dark:text-orange-400" role="alert">
                Hinweis: Bitte fügen Sie zunächst Finanzanlagen hinzu, um eine Berechnung durchführen zu können.
              </p>
            )}
          </div>
        </section>
      )}

      {/* Ladezustand */}
      {isCalculating && (
        <div 
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12"
          role="status"
          aria-busy="true"
        >
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500 dark:text-gray-400">
              Berechnung wird durchgeführt...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
