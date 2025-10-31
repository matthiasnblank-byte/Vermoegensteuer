export interface CaseData {
  id: string;
  organisation: string;
  bereich: string;
  steuerpflichtigePerson: {
    name?: string;
    geburtsdatum?: string;
    steuerId?: string;
    anschrift?: string;
    rechtsform?: string;
    registernummer?: string;
  };
  veranlagungsparameter: {
    bewertungsstichtag: string;
    bewertungswaehrung: string;
    steuerdomizil?: string;
  };
  erklarungsangaben: {
    vollstaendigkeit: boolean;
    mitwirkungspflichten: boolean;
    datenverarbeitung: boolean;
  };
  kommunikation: {
    zustelladresse?: string;
    email?: string;
    telefon?: string;
  };
}

export interface AssetPosition {
  id: string;
  kategorie: string;
  identifikator?: string;
  bezeichnung: string;
  menge: number;
  einheitswert: number;
  positionswert: number;
  bewertungsmethode: string;
  kursdatum: string;
  quelle?: string;
  nachweise?: string[];
}

export interface SchuldPosition {
  id: string;
  glaeubiger: string;
  rechtsgrund: string;
  nennbetrag: number;
  faelligkeit?: string;
  zinssatz?: number;
  besicherung?: string;
}

class StorageService {
  private readonly CASE_KEY = 'b2b_dashboard_case';
  private readonly ASSETS_KEY = 'b2b_dashboard_assets';
  private readonly SCHULDEN_KEY = 'b2b_dashboard_schulden';

  getCase(): CaseData | null {
    const data = localStorage.getItem(this.CASE_KEY);
    return data ? JSON.parse(data) : null;
  }

  saveCase(caseData: CaseData): void {
    localStorage.setItem(this.CASE_KEY, JSON.stringify(caseData));
  }

  getAssets(): AssetPosition[] {
    const data = localStorage.getItem(this.ASSETS_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveAssets(assets: AssetPosition[]): void {
    localStorage.setItem(this.ASSETS_KEY, JSON.stringify(assets));
  }

  getSchulden(): SchuldPosition[] {
    const data = localStorage.getItem(this.SCHULDEN_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveSchulden(schulden: SchuldPosition[]): void {
    localStorage.setItem(this.SCHULDEN_KEY, JSON.stringify(schulden));
  }

  initMockData(): void {
    if (!this.getCase()) {
      this.saveCase({
        id: 'case-1',
        organisation: 'Müller & Schröder GmbH',
        bereich: 'Steuerberatung',
        steuerpflichtigePerson: {
          name: 'Jörg Müller',
          geburtsdatum: '1970-01-15',
          steuerId: '12345678901',
        },
        veranlagungsparameter: {
          bewertungsstichtag: '2024-12-31',
          bewertungswaehrung: 'EUR',
        },
        erklarungsangaben: {
          vollstaendigkeit: false,
          mitwirkungspflichten: false,
          datenverarbeitung: false,
        },
        kommunikation: {
          email: 'max.mustermann@example.com',
        },
      });
    }

    if (this.getAssets().length === 0) {
      this.saveAssets([
        {
          id: 'asset-1',
          kategorie: 'Börsennotierte Wertpapiere',
          identifikator: 'DE0005140008',
          bezeichnung: 'Daimler AG',
          menge: 100,
          einheitswert: 75.50,
          positionswert: 7550,
          bewertungsmethode: '§ 11 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Xetra',
        },
        {
          id: 'asset-2',
          kategorie: 'Börsennotierte Wertpapiere',
          identifikator: 'DE0005140008',
          bezeichnung: 'Siemens AG',
          menge: 50,
          einheitswert: 150.25,
          positionswert: 7512.50,
          bewertungsmethode: '§ 11 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Xetra',
        },
      ]);
    }

    if (this.getSchulden().length === 0) {
      this.saveSchulden([
        {
          id: 'schuld-1',
          glaeubiger: 'Sparkasse Musterhausen',
          rechtsgrund: 'Immobiliendarlehen',
          nennbetrag: 250000,
          faelligkeit: '2045-12-31',
          zinssatz: 2.5,
          besicherung: 'Grundschuld auf Immobilie',
        },
      ]);
    }
  }
}

export const storageService = new StorageService();
