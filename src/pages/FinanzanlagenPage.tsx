import { useState, useEffect } from 'react';
import { AssetPosition, SchuldPosition, storageService } from '../services/storageService';
import Tabs from '../components/Tabs';
import SearchBar from '../components/SearchBar';
import Button from '../components/Button';
import AddAssetModal from '../components/AddAssetModal';
import AddSchuldModal from '../components/AddSchuldModal';
import { PlusIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function FinanzanlagenPage() {
  const [assets, setAssets] = useState<AssetPosition[]>([]);
  const [schulden, setSchulden] = useState<SchuldPosition[]>([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isSchuldModalOpen, setIsSchuldModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Börsennotierte Wertpapiere');

  useEffect(() => {
    storageService.initMockData();
    setAssets(storageService.getAssets());
    setSchulden(storageService.getSchulden());
  }, []);

  const handleAddAsset = (asset: AssetPosition) => {
    const updated = [...assets, asset];
    storageService.saveAssets(updated);
    setAssets(updated);
  };

  const handleAddSchuld = (schuld: SchuldPosition) => {
    const updated = [...schulden, schuld];
    storageService.saveSchulden(updated);
    setSchulden(updated);
  };

  const openAssetModal = (category: string = 'Börsennotierte Wertpapiere') => {
    setSelectedCategory(category);
    setIsAssetModalOpen(true);
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
        onClose={() => setIsAssetModalOpen(false)}
        onSave={handleAddAsset}
        category={selectedCategory}
      />

      <AddSchuldModal
        isOpen={isSchuldModalOpen}
        onClose={() => setIsSchuldModalOpen(false)}
        onSave={handleAddSchuld}
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
                    onSearch={() => {}}
                    onDateFilter={() => {}}
                  />
                  <Button variant="primary" onClick={() => setIsSchuldModalOpen(true)}>
                    <PlusIcon className="h-4 w-4" aria-hidden="true" />
                    Schuld hinzufügen
                  </Button>
                </div>
                <SchuldenContent schulden={schulden} />
              </div>
            ),
          },
        ]}
      />

      <section className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Summenspiegel</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vermögen brutto</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                assets.reduce((sum, a) => sum + a.positionswert, 0)
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Schulden</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                schulden.reduce((sum, s) => sum + s.nennbetrag, 0)
              )}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Vermögen netto</div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
                assets.reduce((sum, a) => sum + a.positionswert, 0) -
                schulden.reduce((sum, s) => sum + s.nennbetrag, 0)
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
}

function AssetCategoryContent({ category, assets }: AssetCategoryContentProps) {
  if (assets.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Positionen vorhanden</p>
        <Button variant="primary" onClick={() => {}} className="mt-4">
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
          {category} ? Bewertungsregel: § 11 BewG bzw. § 9 BewG (gemeiner Wert)
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
                    <Button variant="secondary" onClick={() => {}} className="text-xs py-1 px-2">
                      Bearbeiten
                    </Button>
                    <Button variant="secondary" onClick={() => {}} className="text-xs py-1 px-2">
                      <ArrowUpTrayIcon className="h-3 w-3" aria-hidden="true" />
                    </Button>
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
}

function SchuldenContent({ schulden }: SchuldenContentProps) {
  if (schulden.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Keine Schulden erfasst</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Verwenden Sie den Button oben, um eine neue Schuld hinzuzuf?gen.
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
                  <Button variant="secondary" onClick={() => {}} className="text-xs py-1 px-2">
                    Bearbeiten
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
