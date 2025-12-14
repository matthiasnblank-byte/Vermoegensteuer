export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_KEY = 'ui.theme';

class ThemeService {
  private mediaQuery: MediaQueryList | null = null;
  private listeners: (() => void)[] = [];

  /**
   * Initialisiert das Theme-System und wendet das gespeicherte Theme an
   */
  init(): void {
    this.applyTheme();
    
    // Listener für Systempräferenz-Änderungen
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.handleSystemPreferenceChange);
    }
  }

  /**
   * Bereinigt Listener beim Unmount
   */
  cleanup(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleSystemPreferenceChange);
    }
    this.listeners = [];
  }

  private handleSystemPreferenceChange = () => {
    const pref = this.getPreference();
    if (pref === 'system') {
      this.applyTheme();
    }
  };

  /**
   * Liest die gespeicherte Theme-Präferenz aus localStorage
   */
  getPreference(): ThemePreference {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
    return 'system';
  }

  /**
   * Setzt die Theme-Präferenz und speichert sie
   */
  setPreference(preference: ThemePreference): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(THEME_KEY, preference);
    this.applyTheme();
    this.notifyListeners();
  }

  /**
   * Wendet das aktuelle Theme basierend auf Präferenz und Systemeinstellung an
   */
  applyTheme(): void {
    if (typeof document === 'undefined') return;
    
    const pref = this.getPreference();
    let theme: 'light' | 'dark';

    if (pref === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = systemDark ? 'dark' : 'light';
    } else {
      theme = pref;
    }

    // Tailwind CSS Dark Mode: Klasse auf html-Element setzen
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Fügt einen Listener hinzu, der bei Theme-Änderungen aufgerufen wird
   */
  addListener(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Gibt das aktuell aktive Theme zurück (light oder dark)
   */
  getActiveTheme(): 'light' | 'dark' {
    if (typeof document === 'undefined') return 'light';
    const pref = this.getPreference();
    
    if (pref === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemDark ? 'dark' : 'light';
    }
    
    return pref;
  }
}

export const themeService = new ThemeService();
