import { useState, useEffect } from 'react';
import { AssetPosition, SchuldPosition, storageService } from '../services/storageService';
import Tabs from '../components/Tabs';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import AddAssetModal from '../components/AddAssetModal';
import AddSchuldModal from '../components/AddSchuldModal';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function FinanzanlagenPage() {
  const [assets, setAssets] = useState<AssetPosition[]>([]);
  const [schulden, setSchulden] = useState<SchuldPosition[]>([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isSchuldModalOpen, setIsSchuldModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Börsennotierte Wertpapiere');
  const [editingAsset, setEditingAsset] = useState<AssetPosition | undefined>(undefined);
  const [editingSchuld, setEditingSchuld] = useState<SchuldPosition | undefined>(undefined);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({});

  useEffect(() => {
    storageService.initMockData();
    setAssets(storageService.getAssets());
    setSchulden(storageService.getSchulden());
  }, []);

  const handleAddAsset = (asset: AssetPosition) => {
    const existingIndex = assets.findIndex(a => a.id === asset.id);
    let updated: AssetPosition[];
    if (existingIndex >= 0) {
      // Bearbeiten
      updated = [...assets];
      updated[existingIndex] = asset;
    } else {
      // Hinzufügen
      updated = [...assets, asset];
    }
    storageService.saveAssets(updated);
    setAssets(updated);
    setEditingAsset(undefined);
  };

  const handleAddSchuld = (schuld: SchuldPosition) => {
    const existingIndex = schulden.findIndex(s => s.id === schuld.id);
    let updated: SchuldPosition[];
    if (existingIndex >= 0) {
      // Bearbeiten
      updated = [...schulden];
      updated[existingIndex] = schuld;
    } else {
      // Hinzufügen
      updated = [...schulden, schuld];
    }
    storageService.saveSchulden(updated);
    setSchulden(updated);
    setEditingSchuld(undefined);
  };

  const handleDeleteAsset = (id: string) => {
    if (window.confirm('Möchten Sie diese Position wirklich löschen?')) {
      const updated = assets.filter((a) => a.id !== id);
      storageService.saveAssets(updated);
      setAssets(updated);
    }
  };

  const handleDeleteSchuld = (id: string) => {
    if (window.confirm('Möchten Sie diese Schuld wirklich löschen?')) {
      const updated = schulden.filter((s) => s.id !== id);
      storageService.saveSchulden(updated);
      setSchulden(updated);
    }
  };

  const openAssetModal = (category: string = 'Börsennotierte Wertpapiere', asset?: AssetPosition) => {
    setSelectedCategory(category);
    setEditingAsset(asset);
    setIsAssetModalOpen(true);
  };

  const openSchuldModal = (schuld?: SchuldPosition) => {
    setEditingSchuld(schuld);
    setIsSchuldModalOpen(true);
  };

  const handleSearch = (category: string, query: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [category]: query,
    }));
  };

  const filterAssets = (categoryAssets: AssetPosition[], query: string): AssetPosition[] => {
    if (!query.trim()) return categoryAssets;
    const lowerQuery = query.toLowerCase();
    return categoryAssets.filter(asset =>
      asset.bezeichnung?.toLowerCase().includes(lowerQuery) ||
      asset.identifikator?.toLowerCase().includes(lowerQuery) ||
      asset.quelle?.toLowerCase().includes(lowerQuery)
    );
  };

  const filterSchulden = (schuldenList: SchuldPosition[], query: string): SchuldPosition[] => {
    if (!query.trim()) return schuldenList;
    const lowerQuery = query.toLowerCase();
    return schuldenList.filter(schuld =>
      schuld.glaeubiger?.toLowerCase().includes(lowerQuery) ||
      schuld.rechtsgrund?.toLowerCase().includes(lowerQuery) ||
      schuld.besicherung?.toLowerCase().includes(lowerQuery)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Finanzanlagen & Vermögen</h1>
        <Button variant="primary" onClick={() => openAssetModal()}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          Position hinzufügen
        </Button>
      </div>

      <AddAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => {
          setIsAssetModalOpen(false);
          setEditingAsset(undefined);
        }}
        onSave={handleAddAsset}
        onDelete={handleDeleteAsset}
        category={selectedCategory}
        asset={editingAsset}
      />

      <AddSchuldModal
        isOpen={isSchuldModalOpen}
        onClose={() => {
          setIsSchuldModalOpen(false);
          setEditingSchuld(undefined);
        }}
        onSave={handleAddSchuld}
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
                  onSearch={(query) => handleSearch('Börsennotierte Wertpapiere', query)}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Börsennotierte Wertpapiere"
                  assets={filterAssets(
                    assets.filter((a) => a.kategorie === 'Börsennotierte Wertpapiere'),
                    searchQueries['Börsennotierte Wertpapiere'] || ''
                  )}
                  onAddClick={() => openAssetModal('Börsennotierte Wertpapiere')}
                  onEdit={(asset) => openAssetModal(asset.kategorie, asset)}
                  onDelete={handleDeleteAsset}
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
                  onSearch={(query) => handleSearch('Nicht börsennotierte Investmentanteile', query)}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Nicht börsennotierte Investmentanteile"
                  assets={filterAssets(
                    assets.filter((a) => a.kategorie === 'Nicht börsennotierte Investmentanteile'),
                    searchQueries['Nicht börsennotierte Investmentanteile'] || ''
                  )}
                  onAddClick={() => openAssetModal('Nicht börsennotierte Investmentanteile')}
                  onEdit={(asset) => openAssetModal(asset.kategorie, asset)}
                  onDelete={handleDeleteAsset}
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
                  onSearch={(query) => handleSearch('Kapitalforderungen', query)}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Kapitalforderungen"
                  assets={filterAssets(
                    assets.filter((a) => a.kategorie === 'Kapitalforderungen'),
                    searchQueries['Kapitalforderungen'] || ''
                  )}
                  onAddClick={() => openAssetModal('Kapitalforderungen')}
                  onEdit={(asset) => openAssetModal(asset.kategorie, asset)}
                  onDelete={handleDeleteAsset}
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
                  onSearch={(query) => handleSearch('Sonstige Finanzinstrumente', query)}
                  onDateFilter={() => {}}
                />
                <AssetCategoryContent
                  category="Sonstige Finanzinstrumente"
                  assets={filterAssets(
                    assets.filter((a) => a.kategorie === 'Sonstige Finanzinstrumente'),
                    searchQueries['Sonstige Finanzinstrumente'] || ''
                  )}
                  onAddClick={() => openAssetModal('Sonstige Finanzinstrumente')}
                  onEdit={(asset) => openAssetModal(asset.kategorie, asset)}
                  onDelete={handleDeleteAsset}
                />
              </div>
            ),
          },
          {
            label: 'Schulden',
            badge: schulden.length,
            content: (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <SearchBar
                    onSearch={(query) => handleSearch('Schulden', query)}
                    onDateFilter={() => {}}
                  />
                  <Button variant="primary" onClick={() => openSchuldModal()}>
                    <PlusIcon className="h-4 w-4" aria-hidden="true" />
                    Schuld hinzufügen
                  </Button>
                </div>
                <SchuldenContent
                  schulden={filterSchulden(schulden, searchQueries['Schulden'] || '')}
                  onEdit={(schuld) => openSchuldModal(schuld)}
                  onDelete={handleDeleteSchuld}
                />
              </div>
            ),
          },
        ]}
      />

      <section className="space-y-6 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Summenspiegel</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">Stand: {new Date().toLocaleDateString('de-DE')}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vermögen brutto */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">Vermögen brutto</span>
                </div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                    assets.reduce((sum, a) => sum + a.positionswert, 0)
                  )}
                </div>
                <div className="text-xs text-green-700 dark:text-green-400">
                  {assets.length} Positionen
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 dark:opacity-5">
                <svg className="h-32 w-32 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.86-.95-7-5.35-7-10V8.64l7-3.82 7 3.82V10c0 4.65-3.14 9.05-7 10z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Schulden */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                  </svg>
                  <span className="text-sm font-medium text-red-800 dark:text-red-300">Schulden</span>
                </div>
                <div className="text-3xl font-bold text-red-900 dark:text-red-100 mb-1">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                    schulden.reduce((sum, s) => sum + s.nennbetrag, 0)
                  )}
                </div>
                <div className="text-xs text-red-700 dark:text-red-400">
                  {schulden.length} Verbindlichkeiten
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 dark:opacity-5">
                <svg className="h-32 w-32 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Vermögen netto */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border-2 border-blue-200 dark:border-blue-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Vermögen netto</span>
                </div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                  {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                    assets.reduce((sum, a) => sum + a.positionswert, 0) -
                    schulden.reduce((sum, s) => sum + s.nennbetrag, 0)
                  )}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-400">
                  Steuerbemessungsgrundlage
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10 dark:opacity-5">
                <svg className="h-32 w-32 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Zusätzliche Informationen */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                <strong>Hinweis zur Vermögensteuer:</strong> Die Berechnung basiert auf den eingegebenen Werten zum Bewertungsstichtag.
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Bewertungsgrundlage: §§ 9-12 BewG | Stichtag: {new Date().toLocaleDateString('de-DE')}
              </p>
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
  onAddClick: () => void;
  onEdit: (asset: AssetPosition) => void;
  onDelete: (id: string) => void;
}

function AssetCategoryContent({ category, assets, onAddClick, onEdit, onDelete }: AssetCategoryContentProps) {
  if (assets.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Positionen vorhanden</p>
        <Button variant="primary" onClick={onAddClick} className="mt-4">
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
}

function SchuldenContent({ schulden, onEdit, onDelete }: SchuldenContentProps) {
  if (schulden.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Schulden erfasst</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Verwenden Sie den Button oben, um eine neue Schuld hinzuzufügen.
        </p>
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
