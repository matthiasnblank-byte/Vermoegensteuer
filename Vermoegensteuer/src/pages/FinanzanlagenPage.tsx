import { useState, useEffect } from 'react';
import { AssetPosition, SchuldPosition, storageService } from '../services/storageService';
import Tabs from '../components/Tabs';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import AssetDialog from '../components/AssetDialog';
import SchuldDialog from '../components/SchuldDialog';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function FinanzanlagenPage() {
  const [assets, setAssets] = useState<AssetPosition[]>([]);
  const [schulden, setSchulden] = useState<SchuldPosition[]>([]);
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [isSchuldDialogOpen, setIsSchuldDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetPosition | undefined>(undefined);
  const [editingSchuld, setEditingSchuld] = useState<SchuldPosition | undefined>(undefined);
  const [currentKategorie, setCurrentKategorie] = useState('Börsennotierte Wertpapiere');

  useEffect(() => {
    storageService.initMockData();
    setAssets(storageService.getAssets());
    setSchulden(storageService.getSchulden());
  }, []);

  const handleAddAsset = (kategorie: string) => {
    setCurrentKategorie(kategorie);
    setEditingAsset(undefined);
    setIsAssetDialogOpen(true);
  };

  const handleEditAsset = (asset: AssetPosition) => {
    setEditingAsset(asset);
    setCurrentKategorie(asset.kategorie);
    setIsAssetDialogOpen(true);
  };

  const handleSaveAsset = (asset: AssetPosition) => {
    let updated: AssetPosition[];
    
    if (editingAsset) {
      // Bearbeiten
      updated = assets.map((a) => (a.id === asset.id ? asset : a));
    } else {
      // Neu hinzufügen
      updated = [...assets, asset];
    }
    
    storageService.saveAssets(updated);
    setAssets(updated);
    setIsAssetDialogOpen(false);
    setEditingAsset(undefined);
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Möchten Sie diese Position wirklich löschen?')) {
      const updated = assets.filter((a) => a.id !== id);
      storageService.saveAssets(updated);
      setAssets(updated);
    }
  };

  const handleAddSchuld = () => {
    setEditingSchuld(undefined);
    setIsSchuldDialogOpen(true);
  };

  const handleEditSchuld = (schuld: SchuldPosition) => {
    setEditingSchuld(schuld);
    setIsSchuldDialogOpen(true);
  };

  const handleSaveSchuld = (schuld: SchuldPosition) => {
    let updated: SchuldPosition[];
    
    if (editingSchuld) {
      // Bearbeiten
      updated = schulden.map((s) => (s.id === schuld.id ? schuld : s));
    } else {
      // Neu hinzufügen
      updated = [...schulden, schuld];
    }
    
    storageService.saveSchulden(updated);
    setSchulden(updated);
    setIsSchuldDialogOpen(false);
    setEditingSchuld(undefined);
  };

  const handleDeleteSchuld = (id: string) => {
    if (window.confirm('Möchten Sie diese Schuld wirklich löschen?')) {
      const updated = schulden.filter((s) => s.id !== id);
      storageService.saveSchulden(updated);
      setSchulden(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Finanzanlagen & Vermögen</h1>
        <Button variant="primary" onClick={() => handleAddAsset(currentKategorie)}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Position hinzufügen
        </Button>
      </div>

      <AssetDialog
        isOpen={isAssetDialogOpen}
        onClose={() => setIsAssetDialogOpen(false)}
        onSave={handleSaveAsset}
        onDelete={handleDeleteAsset}
        asset={editingAsset}
        kategorie={currentKategorie}
      />

      <SchuldDialog
        isOpen={isSchuldDialogOpen}
        onClose={() => setIsSchuldDialogOpen(false)}
        onSave={handleSaveSchuld}
        onDelete={handleDeleteSchuld}
        schuld={editingSchuld}
      />

      <Tabs
        items={[
          {
            label: 'Börsennotierte Wertpapiere',
            badge: assets.filter((a) => a.kategorie === 'Börsennotierte Wertpapiere').length,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={() => {}}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Börsennotierte Wertpapiere"
                  assets={assets.filter((a) => a.kategorie === 'Börsennotierte Wertpapiere')}
                  onEdit={handleEditAsset}
                  onDelete={handleDeleteAsset}
                  onAdd={() => handleAddAsset('Börsennotierte Wertpapiere')}
                />
              </div>
            ),
          },
          {
            label: 'Fonds / Investmentanteile',
            badge: assets.filter((a) => a.kategorie === 'Nicht börsennotierte Investmentanteile').length,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={() => {}}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Nicht börsennotierte Investmentanteile"
                  assets={assets.filter((a) => a.kategorie === 'Nicht börsennotierte Investmentanteile')}
                  onEdit={handleEditAsset}
                  onDelete={handleDeleteAsset}
                  onAdd={() => handleAddAsset('Nicht börsennotierte Investmentanteile')}
                />
              </div>
            ),
          },
          {
            label: 'Bankguthaben & Forderungen',
            badge: assets.filter((a) => a.kategorie === 'Kapitalforderungen').length,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={() => {}}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Kapitalforderungen"
                  assets={assets.filter((a) => a.kategorie === 'Kapitalforderungen')}
                  onEdit={handleEditAsset}
                  onDelete={handleDeleteAsset}
                  onAdd={() => handleAddAsset('Kapitalforderungen')}
                />
              </div>
            ),
          },
          {
            label: 'Sonstige / Krypto',
            badge: assets.filter((a) => a.kategorie === 'Sonstige Finanzinstrumente').length,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={() => {}}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Sonstige Finanzinstrumente"
                  assets={assets.filter((a) => a.kategorie === 'Sonstige Finanzinstrumente')}
                  onEdit={handleEditAsset}
                  onDelete={handleDeleteAsset}
                  onAdd={() => handleAddAsset('Sonstige Finanzinstrumente')}
                />
              </div>
            ),
          },
          {
            label: 'Schulden',
            badge: schulden.length,
            content: (
              <div className="space-y-4">
                <SearchBar
                  onSearch={() => {}}
                  onDateFilter={() => {}}
                />
                <SchuldenContent
                  schulden={schulden}
                  onEdit={handleEditSchuld}
                  onDelete={handleDeleteSchuld}
                  onAdd={handleAddSchuld}
                />
              </div>
            ),
          },
          {
            label: 'Berechnung',
            content: (
              <VermoegensteuerBerechnung
                assets={assets}
                schulden={schulden}
              />
            ),
          },
          {
            label: 'Berechnungsliste (DATEV)',
            content: (
              <DatevBerechnungsliste
                assets={assets}
                schulden={schulden}
              />
            ),
          },
        ]}
      />

      <section className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Summenspiegel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Vermögen brutto</div>
            <div className="text-2xl font-semibold text-green-900 dark:text-green-300">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                assets.reduce((sum, a) => sum + (Number(a.positionswert) || 0), 0)
              )}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Schulden</div>
            <div className="text-2xl font-semibold text-red-900 dark:text-red-300">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                schulden.reduce((sum, s) => sum + (Number(s.nennbetrag) || 0), 0)
              )}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">Vermögen netto</div>
            <div className="text-2xl font-semibold text-blue-900 dark:text-blue-300">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                assets.reduce((sum, a) => sum + (Number(a.positionswert) || 0), 0) -
                schulden.reduce((sum, s) => sum + (Number(s.nennbetrag) || 0), 0)
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface VermoegensteuerBerechnungProps {
  assets: AssetPosition[];
  schulden: SchuldPosition[];
}

function VermoegensteuerBerechnung({ assets, schulden }: VermoegensteuerBerechnungProps) {
  // Berechnung der Vermögenswerte
  const bruttovermoegen = assets.reduce((sum, a) => sum + (Number(a.positionswert) || 0), 0);
  const gesamtschulden = schulden.reduce((sum, s) => sum + (Number(s.nennbetrag) || 0), 0);
  const nettovermoegen = bruttovermoegen - gesamtschulden;

  // Vermögensteuer-Parameter (beispielhafte Werte)
  const freibetrag = 500000; // € 500.000 Freibetrag
  const steuerpflichtiges = Math.max(0, nettovermoegen - freibetrag);

  // Progressive Steuersätze
  const calculateTax = (amount: number): number => {
    if (amount <= 0) return 0;
    
    // Beispiel: Progressive Staffelung
    let tax = 0;
    if (amount > 0) {
      const bis5Mio = Math.min(amount, 5000000);
      tax += bis5Mio * 0.005; // 0,5% bis 5 Mio.
    }
    if (amount > 5000000) {
      const bis10Mio = Math.min(amount - 5000000, 5000000);
      tax += bis10Mio * 0.007; // 0,7% von 5-10 Mio.
    }
    if (amount > 10000000) {
      const ueber10Mio = amount - 10000000;
      tax += ueber10Mio * 0.01; // 1% über 10 Mio.
    }
    
    return tax;
  };

  const vermoegensteuer = calculateTax(steuerpflichtiges);
  const effektiverSteuersatz = nettovermoegen > 0 ? (vermoegensteuer / nettovermoegen) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Vermögensteuerberechnung
        </h2>

        <div className="space-y-4">
          {/* Vermögensaufstellung */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bruttovermögen</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(bruttovermoegen)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">./. Schulden</span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(gesamtschulden)}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-gray-100">Nettovermögen</span>
              <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(nettovermoegen)}
              </span>
            </div>
          </div>

          {/* Steuerberechnung */}
          <div className="space-y-3 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Nettovermögen</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(nettovermoegen)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">./. Freibetrag</span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(freibetrag)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
              <span className="font-medium text-gray-900 dark:text-gray-100">Steuerpflichtiges Vermögen</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(steuerpflichtiges)}
              </span>
            </div>
          </div>

          {/* Steuersätze */}
          <div className="space-y-2 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg px-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Progressive Steuersätze
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">bis 5 Mio. €</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">0,5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">5 - 10 Mio. €</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">0,7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">über 10 Mio. €</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">1,0%</span>
              </div>
            </div>
          </div>

          {/* Ergebnis */}
          <div className="space-y-3 pt-4">
            <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Vermögensteuer (jährlich)
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(vermoegensteuer)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Effektiver Steuersatz</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {effektiverSteuersatz.toFixed(3)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hinweise */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
          Hinweise zur Berechnung
        </h3>
        <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1 list-disc list-inside">
          <li>Die Berechnung erfolgt auf Basis des Nettovermögens (Bruttovermögen ./. Schulden)</li>
          <li>Freibetrag: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(freibetrag)}</li>
          <li>Progressive Steuersätze werden auf das steuerpflichtige Vermögen angewendet</li>
          <li>Diese Berechnung dient nur zur Orientierung und ersetzt keine steuerliche Beratung</li>
        </ul>
      </div>
    </div>
  );
}

interface DatevBerechnungslisteProps {
  assets: AssetPosition[];
  schulden: SchuldPosition[];
}

function DatevBerechnungsliste({ assets, schulden }: DatevBerechnungslisteProps) {
  const bruttovermoegen = assets.reduce((sum, a) => sum + (Number(a.positionswert) || 0), 0);
  const gesamtschulden = schulden.reduce((sum, s) => sum + (Number(s.nennbetrag) || 0), 0);
  const nettovermoegen = bruttovermoegen - gesamtschulden;

  // Gruppierung nach Kategorien
  const kategorien = [
    'Börsennotierte Wertpapiere',
    'Nicht börsennotierte Investmentanteile',
    'Kapitalforderungen',
    'Sonstige Finanzinstrumente'
  ];

  const kategorieWerte = kategorien.map(kat => ({
    name: kat,
    positionen: assets.filter(a => a.kategorie === kat),
    summe: assets.filter(a => a.kategorie === kat).reduce((sum, a) => sum + a.positionswert, 0)
  }));

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Vermögensaufstellung nach DATEV-Standard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Bewertungsstichtag: {new Date().toLocaleDateString('de-DE')}
          </p>
        </div>

        {/* Berechnungsliste */}
        <div className="p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-gray-100">Pos.</th>
                <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-gray-100">Bezeichnung</th>
                <th className="text-right py-2 px-2 font-semibold text-gray-900 dark:text-gray-100">Wert (EUR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Aktiva */}
              <tr className="bg-blue-50 dark:bg-blue-900/20">
                <td colSpan={3} className="py-3 px-2 font-bold text-gray-900 dark:text-gray-100">
                  A. AKTIVA
                </td>
              </tr>

              {kategorieWerte.map((kat, index) => (
                <>
                  <tr key={`kat-${index}`} className="bg-gray-50 dark:bg-gray-800/50">
                    <td className="py-2 px-2 font-semibold text-gray-900 dark:text-gray-100">
                      {index + 1}.
                    </td>
                    <td colSpan={2} className="py-2 px-2 font-semibold text-gray-900 dark:text-gray-100">
                      {kat.name}
                    </td>
                  </tr>
                  {kat.positionen.map((pos, pIndex) => (
                    <tr key={`pos-${index}-${pIndex}`}>
                      <td className="py-1.5 px-2 pl-8 text-gray-600 dark:text-gray-400">
                        {index + 1}.{pIndex + 1}
                      </td>
                      <td className="py-1.5 px-2 text-gray-900 dark:text-gray-100">
                        {pos.bezeichnung}
                        {pos.identifikator && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            ({pos.identifikator})
                          </span>
                        )}
                      </td>
                      <td className="py-1.5 px-2 text-right font-mono text-gray-900 dark:text-gray-100">
                        {new Intl.NumberFormat('de-DE', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(pos.positionswert)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold border-t border-gray-300 dark:border-gray-600">
                    <td className="py-2 px-2"></td>
                    <td className="py-2 px-2 text-gray-900 dark:text-gray-100">
                      Summe {kat.name}
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-gray-900 dark:text-gray-100">
                      {new Intl.NumberFormat('de-DE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(kat.summe)}
                    </td>
                  </tr>
                </>
              ))}

              {/* Summe Aktiva */}
              <tr className="bg-blue-100 dark:bg-blue-900/30 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2 text-gray-900 dark:text-gray-100">
                  SUMME AKTIVA (Bruttovermögen)
                </td>
                <td className="py-3 px-2 text-right font-mono text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(bruttovermoegen)}
                </td>
              </tr>

              {/* Passiva */}
              <tr className="bg-red-50 dark:bg-red-900/20">
                <td colSpan={3} className="py-3 px-2 font-bold text-gray-900 dark:text-gray-100">
                  B. PASSIVA (Schulden)
                </td>
              </tr>

              {schulden.map((schuld, index) => (
                <tr key={`schuld-${index}`}>
                  <td className="py-1.5 px-2 text-gray-600 dark:text-gray-400">
                    {index + 1}.
                  </td>
                  <td className="py-1.5 px-2 text-gray-900 dark:text-gray-100">
                    {schuld.glaeubiger}
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                      ({schuld.rechtsgrund})
                    </span>
                  </td>
                  <td className="py-1.5 px-2 text-right font-mono text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat('de-DE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(schuld.nennbetrag)}
                  </td>
                </tr>
              ))}

              {/* Summe Passiva */}
              <tr className="bg-red-100 dark:bg-red-900/30 font-bold border-t-2 border-gray-400 dark:border-gray-500">
                <td className="py-3 px-2"></td>
                <td className="py-3 px-2 text-gray-900 dark:text-gray-100">
                  SUMME PASSIVA (Schulden)
                </td>
                <td className="py-3 px-2 text-right font-mono text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(gesamtschulden)}
                </td>
              </tr>

              {/* Nettovermögen */}
              <tr className="bg-green-100 dark:bg-green-900/30 font-bold border-t-4 border-gray-500 dark:border-gray-400">
                <td className="py-4 px-2"></td>
                <td className="py-4 px-2 text-lg text-gray-900 dark:text-gray-100">
                  NETTOVERMÖGEN
                </td>
                <td className="py-4 px-2 text-right text-lg font-mono text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(nettovermoegen)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-semibold mb-1">Bewertungsgrundlagen:</p>
              <ul className="space-y-0.5">
                <li>• Börsennotierte Wertpapiere: § 11 BewG</li>
                <li>• Investmentanteile: § 9 BewG (gemeiner Wert)</li>
                <li>• Kapitalforderungen: § 12 BewG (Nennwert)</li>
                <li>• Schulden: § 12 Abs. 1 BewG (Nennwert)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">Erstellungsdatum:</p>
              <p>{new Date().toLocaleDateString('de-DE', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
              <p className="mt-2 text-xs italic">
                Diese Aufstellung entspricht den DATEV-Richtlinien für Vermögensaufstellungen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AssetCategoryContentProps {
  category: string;
  assets: AssetPosition[];
  onEdit: (asset: AssetPosition) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function AssetCategoryContent({ category, assets, onEdit, onDelete, onAdd }: AssetCategoryContentProps) {
  if (assets.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Positionen vorhanden</p>
        <Button variant="primary" onClick={onAdd} className="mt-4">
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Erste Position hinzufügen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {category} – Bewertungsregel: § 11 BewG bzw. § 9 BewG (gemeiner Wert)
        </p>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">ISIN/WKN</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Bezeichnung</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Stückzahl</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Einheitswert</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Positionswert</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Kursdatum</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Quelle</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{asset.identifikator || '-'}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">{asset.bezeichnung}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{asset.menge}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(asset.einheitswert)}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(asset.positionswert)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {new Date(asset.kursdatum).toLocaleDateString('de-DE')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{asset.quelle || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(asset)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      title="Bearbeiten"
                    >
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => onDelete(asset.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Löschen"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SchuldenContentProps {
  schulden: SchuldPosition[];
  onEdit: (schuld: SchuldPosition) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

function SchuldenContent({ schulden, onEdit, onDelete, onAdd }: SchuldenContentProps) {
  if (schulden.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Schulden erfasst</p>
        <Button variant="primary" onClick={onAdd} className="mt-4">
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Erste Schuld hinzufügen
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Schulden – Bewertungsregel: § 12 Abs. 1 BewG (Nennwert)
        </p>
      </div>
      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Gläubiger</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Rechtsgrund</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Nennbetrag</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Fälligkeit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Zinssatz</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {schulden.map((schuld) => (
              <tr key={schuld.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{schuld.glaeubiger}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{schuld.rechtsgrund}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(schuld.nennbetrag)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {schuld.faelligkeit ? new Date(schuld.faelligkeit).toLocaleDateString('de-DE') : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{schuld.zinssatz ? `${schuld.zinssatz}%` : '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(schuld)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      title="Bearbeiten"
                    >
                      <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => onDelete(schuld.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
                      title="Löschen"
                    >
                      <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
