import { useEffect, useState } from 'react';
import { storageService, AssetPosition, SchuldPosition } from '../services/storageService';
import {
  CalculatorIcon,
  ChartBarIcon,
  CurrencyEuroIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Button from '../components/Button';

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

export default function BerechnungenPage() {
  const [assets, setAssets] = useState<AssetPosition[]>([]);
  const [schulden, setSchulden] = useState<SchuldPosition[]>([]);
  const [ergebnis, setErgebnis] = useState<BerechnungErgebnis | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    storageService.initMockData();
    setAssets(storageService.getAssets());
    setSchulden(storageService.getSchulden());
  }, []);

  const berechneVermoegensteuer = () => {
    setIsCalculating(true);

    // Simuliere kurze Berechnungszeit für bessere UX
    setTimeout(() => {
      // 1. Gesamtvermögen berechnen (Summe aller Vermögenspositionen)
      const gesamtvermoegen = assets.reduce((sum, asset) => sum + asset.positionswert, 0);

      // 2. Gesamtschulden berechnen (Summe aller Verbindlichkeiten)
      const gesamtschulden = schulden.reduce((sum, schuld) => sum + schuld.nennbetrag, 0);

      // 3. Reinvermögen berechnen (Vermögen - Schulden)
      // Hinweis: Negative Werte führen faktisch zu keiner Vermögensteuer (Bemessungsgrundlage >= 0)
      const reinvermoegen = Math.max(0, gesamtvermoegen - gesamtschulden);

      // 4. Freibetrag (Modellannahme für natürliche Personen)
      const freibetrag = 1000000;

      // 5. Steuerpflichtiges Vermögen berechnen
      const steuerpflichtigesVermoegen = Math.max(0, reinvermoegen - freibetrag);

      // 6. Steuerbetrag berechnen (vereinfachtes progressives Modell)
      // - 0-5 Mio: 1,0%
      // - 5-10 Mio: 1,5%
      // - über 10 Mio: 2,0%
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

      // 7. Effektiver Steuersatz bezogen auf Reinvermögen
      const effektiverSteuersatz = reinvermoegen > 0 ? (steuerbetrag / reinvermoegen) * 100 : 0;

      // 8. Bewertungsstichtag aus den Stammdaten holen
      const caseData = storageService.getCase();
      const bewertungsstichtag =
        caseData?.veranlagungsparameter?.bewertungsstichtag || new Date().toISOString().split('T')[0];

      setErgebnis({
        gesamtvermoegen,
        gesamtschulden,
        reinvermoegen,
        freibetrag,
        steuerpflichtigesVermoegen,
        steuerbetrag,
        effektiverSteuersatz,
        bewertungsstichtag,
      });

      setIsCalculating(false);
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Vermögensteuer-Berechnungen
        </h1>
        <Button
          variant="primary"
          onClick={berechneVermoegensteuer}
          disabled={isCalculating || assets.length === 0}
        >
          <CalculatorIcon className="h-5 w-5" aria-hidden="true" />
          {isCalculating ? 'Berechne...' : 'Berechnung starten'}
        </Button>
      </div>

      {/* Hinweis */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <DocumentTextIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium mb-1">Hinweis zur Modellrechnung</p>
            <p>
              In Deutschland ist die Vermögensteuer derzeit ausgesetzt. Diese Berechnung verwendet
              nachvollziehbare Modellannahmen (Freibetrag, progressive Sätze) und dient der
              Planung/Simulation.
            </p>
          </div>
        </div>
      </div>

      {ergebnis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gesamtvermögen
                </h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.gesamtvermoegen)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {assets.length} Vermögenspositionen
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <ChartBarIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gesamtschulden</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.gesamtschulden)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {schulden.length} Verbindlichkeiten
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <CurrencyEuroIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Reinvermögen</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.reinvermoegen)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vermögen abzgl. Schulden</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CalculatorIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Steuerbetrag</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(ergebnis.steuerbetrag)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatPercent(ergebnis.effektiverSteuersatz)} eff. Steuersatz
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Detaillierte Berechnungsschritte
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">1. Gesamtvermögen</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Summe aller Vermögenspositionen
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {formatCurrency(ergebnis.gesamtvermoegen)}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    2. Abzüglich Gesamtschulden
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Summe aller Verbindlichkeiten
                  </p>
                </div>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  - {formatCurrency(ergebnis.gesamtschulden)}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">= Reinvermögen</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Bemessungsgrundlage vor Freibetrag (min. 0)
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formatCurrency(ergebnis.reinvermoegen)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">3. Abzüglich Freibetrag</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Modellannahme</p>
                </div>
                <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                  - {formatCurrency(ergebnis.freibetrag)}
                </p>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
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
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                  4. Anwendung des progressiven Steuertarifs
                </p>
                <div className="space-y-2 pl-4">
                  <div className="text-xs text-gray-600 dark:text-gray-400">• Bis 5 Mio. EUR: 1,0%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">• 5-10 Mio. EUR: 1,5%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">• Über 10 Mio. EUR: 2,0%</div>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-4">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
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
              </div>
            </div>
          </div>
        </div>
      )}

      {!ergebnis && !isCalculating && (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="text-center">
            <CalculatorIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Keine Berechnung vorhanden
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Klicken Sie auf &quot;Berechnung starten&quot;, um eine Vermögensteuerberechnung basierend
              auf Ihren Stammdaten und Finanzanlagen durchzuführen.
            </p>
            {assets.length === 0 && (
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Hinweis: Bitte fügen Sie zunächst Finanzanlagen hinzu, um eine Berechnung durchführen zu können.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

