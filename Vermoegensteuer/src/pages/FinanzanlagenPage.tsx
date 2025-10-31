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
        asset={editingAsset}
        kategorie={currentKategorie}
      />

      <SchuldDialog
        isOpen={isSchuldDialogOpen}
        onClose={() => setIsSchuldDialogOpen(false)}
        onSave={handleSaveSchuld}
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
