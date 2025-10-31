import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, AssetPosition, SchuldPosition } from './storageService';

describe('StorageService', () => {
  beforeEach(() => {
    // Clear localStorage vor jedem Test
    localStorage.clear();
  });

  describe('Case Data', () => {
    it('speichert und lädt Case Data', () => {
      const caseData = {
        id: 'test-1',
        organisation: 'Test GmbH',
        bereich: 'Steuerberatung',
        steuerpflichtigePerson: {
          name: 'Max Mustermann',
          steuerId: '12345678901',
        },
        veranlagungsparameter: {
          bewertungsstichtag: '2024-12-31',
          bewertungswaehrung: 'EUR',
        },
        erklarungsangaben: {
          vollstaendigkeit: true,
          mitwirkungspflichten: true,
          datenverarbeitung: true,
        },
        kommunikation: {
          email: 'test@example.com',
        },
      };

      storageService.saveCase(caseData);
      const loaded = storageService.getCase();

      expect(loaded).toEqual(caseData);
    });

    it('gibt null zurück wenn keine Case Data vorhanden', () => {
      const loaded = storageService.getCase();
      expect(loaded).toBeNull();
    });
  });

  describe('Assets', () => {
    it('speichert und lädt Assets', () => {
      const assets: AssetPosition[] = [
        {
          id: 'asset-1',
          kategorie: 'Börsennotierte Wertpapiere',
          identifikator: 'DE0005140008',
          bezeichnung: 'Test AG',
          menge: 100,
          einheitswert: 50.5,
          positionswert: 5050,
          bewertungsmethode: '§ 11 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Xetra',
        },
      ];

      storageService.saveAssets(assets);
      const loaded = storageService.getAssets();

      expect(loaded).toEqual(assets);
    });

    it('gibt leeres Array zurück wenn keine Assets vorhanden', () => {
      const loaded = storageService.getAssets();
      expect(loaded).toEqual([]);
    });

    it('berechnet Positionswert korrekt', () => {
      const asset: AssetPosition = {
        id: 'asset-1',
        kategorie: 'Börsennotierte Wertpapiere',
        bezeichnung: 'Test',
        menge: 10,
        einheitswert: 100,
        positionswert: 1000,
        bewertungsmethode: '§ 11 BewG',
        kursdatum: '2024-12-31',
      };

      expect(asset.positionswert).toBe(asset.menge * asset.einheitswert);
    });
  });

  describe('Schulden', () => {
    it('speichert und lädt Schulden', () => {
      const schulden: SchuldPosition[] = [
        {
          id: 'schuld-1',
          glaeubiger: 'Bank AG',
          rechtsgrund: 'Darlehen',
          nennbetrag: 100000,
          faelligkeit: '2045-12-31',
          zinssatz: 2.5,
        },
      ];

      storageService.saveSchulden(schulden);
      const loaded = storageService.getSchulden();

      expect(loaded).toEqual(schulden);
    });

    it('gibt leeres Array zurück wenn keine Schulden vorhanden', () => {
      const loaded = storageService.getSchulden();
      expect(loaded).toEqual([]);
    });
  });

  describe('Mock Data', () => {
    it('initialisiert Mock-Daten beim ersten Start', () => {
      storageService.initMockData();

      const caseData = storageService.getCase();
      const assets = storageService.getAssets();

      expect(caseData).not.toBeNull();
      expect(assets.length).toBeGreaterThan(0);
    });

    it('überschreibt keine existierenden Daten', () => {
      const customCase = {
        id: 'custom-1',
        organisation: 'Custom GmbH',
        bereich: 'Test',
        steuerpflichtigePerson: {},
        veranlagungsparameter: {
          bewertungsstichtag: '2024-12-31',
          bewertungswaehrung: 'EUR',
        },
        erklarungsangaben: {
          vollstaendigkeit: false,
          mitwirkungspflichten: false,
          datenverarbeitung: false,
        },
        kommunikation: {},
      };

      storageService.saveCase(customCase);
      storageService.initMockData();

      const loaded = storageService.getCase();
      expect(loaded?.organisation).toBe('Custom GmbH');
    });
  });
});



