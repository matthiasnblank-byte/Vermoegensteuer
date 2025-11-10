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
          anschrift: 'Musterstraße 123, 80331 München',
          rechtsform: 'Einzelunternehmen',
          registernummer: 'HRB 123456',
        },
        veranlagungsparameter: {
          bewertungsstichtag: '2024-12-31',
          bewertungswaehrung: 'EUR',
          steuerdomizil: 'Deutschland',
        },
        erklarungsangaben: {
          vollstaendigkeit: true,
          mitwirkungspflichten: true,
          datenverarbeitung: true,
        },
        kommunikation: {
          zustelladresse: 'Müller & Schröder GmbH\nMusterstraße 123\n80331 München',
          email: 'joerg.mueller@mueller-schroeder.de',
          telefon: '+49 89 12345678',
        },
      });
    }

    if (this.getAssets().length === 0) {
      this.saveAssets([
        {
          id: 'asset-1',
          kategorie: 'Börsennotierte Wertpapiere',
          identifikator: 'DE0005140008',
          bezeichnung: 'Deutsche Telekom AG',
          menge: 100,
          einheitswert: 75.5,
          positionswert: 7550,
          bewertungsmethode: '§ 11 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Xetra',
        },
        {
          id: 'asset-2',
          kategorie: 'Börsennotierte Wertpapiere',
          identifikator: 'US0378331005',
          bezeichnung: 'Apple Inc.',
          menge: 25,
          einheitswert: 150.0,
          positionswert: 3750,
          bewertungsmethode: '§ 11 BewG',
          kursdatum: '2024-12-31',
          quelle: 'NASDAQ',
        },
        {
          id: 'asset-3',
          kategorie: 'Börsennotierte Wertpapiere',
          identifikator: 'DE0007236101',
          bezeichnung: 'Siemens AG',
          menge: 50,
          einheitswert: 165.0,
          positionswert: 8250,
          bewertungsmethode: '§ 11 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Xetra',
        },
        {
          id: 'asset-4',
          kategorie: 'Nicht börsennotierte Investmentanteile',
          identifikator: 'DE0008491051',
          bezeichnung: 'DWS Top Dividende LD',
          menge: 150,
          einheitswert: 180.5,
          positionswert: 27075,
          bewertungsmethode: '§ 9 BewG (gemeiner Wert)',
          kursdatum: '2024-12-31',
          quelle: 'DWS',
        },
        {
          id: 'asset-5',
          kategorie: 'Nicht börsennotierte Investmentanteile',
          identifikator: 'LU0274208692',
          bezeichnung: 'Xtrackers MSCI World UCITS ETF',
          menge: 100,
          einheitswert: 95.0,
          positionswert: 9500,
          bewertungsmethode: '§ 9 BewG (gemeiner Wert)',
          kursdatum: '2024-12-31',
          quelle: 'Bloomberg',
        },
        {
          id: 'asset-6',
          kategorie: 'Kapitalforderungen',
          identifikator: 'DE12345678901234567890',
          bezeichnung: 'Tagesgeldkonto Sparkasse München',
          menge: 1,
          einheitswert: 25000,
          positionswert: 25000,
          bewertungsmethode: '§ 12 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Kontoauszug',
        },
        {
          id: 'asset-7',
          kategorie: 'Kapitalforderungen',
          identifikator: 'DE09876543210987654321',
          bezeichnung: 'Festgeld Deutsche Bank',
          menge: 1,
          einheitswert: 50000,
          positionswert: 50000,
          bewertungsmethode: '§ 12 BewG',
          kursdatum: '2024-12-31',
          quelle: 'Kontoauszug',
        },
        {
          id: 'asset-8',
          kategorie: 'Sonstige Finanzinstrumente',
          bezeichnung: 'Bitcoin (BTC)',
          menge: 0.5,
          einheitswert: 42000,
          positionswert: 21000,
          bewertungsmethode: '§ 9 BewG (gemeiner Wert)',
          kursdatum: '2024-12-31',
          quelle: 'Coinbase',
        },
        {
          id: 'asset-9',
          kategorie: 'Sonstige Finanzinstrumente',
          bezeichnung: 'Ethereum (ETH)',
          menge: 5,
          einheitswert: 2200,
          positionswert: 11000,
          bewertungsmethode: '§ 9 BewG (gemeiner Wert)',
          kursdatum: '2024-12-31',
          quelle: 'Coinbase',
        },
      ]);
    }

    if (this.getSchulden().length === 0) {
      this.saveSchulden([
        {
          id: 'schuld-1',
          glaeubiger: 'Sparkasse München',
          rechtsgrund: 'Immobilienkredit',
          nennbetrag: 250000,
          faelligkeit: '2044-12-31',
          zinssatz: 2.5,
          besicherung: 'Grundschuld Immobilie',
        },
        {
          id: 'schuld-2',
          glaeubiger: 'Deutsche Bank',
          rechtsgrund: 'Betriebsmittelkredit',
          nennbetrag: 50000,
          faelligkeit: '2027-06-30',
          zinssatz: 3.8,
          besicherung: 'Bürgschaft',
        },
        {
          id: 'schuld-3',
          glaeubiger: 'KfW',
          rechtsgrund: 'Förderdarlehen',
          nennbetrag: 75000,
          faelligkeit: '2029-12-31',
          zinssatz: 1.2,
          besicherung: 'Nachrangig',
        },
      ]);
    }
  }
}

export const storageService = new StorageService();
