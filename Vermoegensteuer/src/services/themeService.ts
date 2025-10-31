export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeListener = () => void;

class ThemeService {
  private readonly THEME_KEY = 'b2b_dashboard_theme';
  private listeners: ThemeListener[] = [];
  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.initTheme();
    this.setupMediaQueryListener();
  }

  private setupMediaQueryListener() {
    this.mediaQuery.addEventListener('change', () => {
      const preference = this.getPreference();
      if (preference === 'system') {
        this.applyTheme(this.mediaQuery.matches ? 'dark' : 'light');
        this.notifyListeners();
      }
    });
  }

  private initTheme() {
    const preference = this.getPreference();
    this.applyPreference(preference);
  }

  private applyPreference(preference: ThemePreference) {
    if (preference === 'system') {
      this.applyTheme(this.mediaQuery.matches ? 'dark' : 'light');
    } else {
      this.applyTheme(preference);
    }
  }

  private applyTheme(theme: 'light' | 'dark') {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  getPreference(): ThemePreference {
    const saved = localStorage.getItem(this.THEME_KEY) as ThemePreference | null;
    return saved || 'system';
  }

  setPreference(preference: ThemePreference) {
    localStorage.setItem(this.THEME_KEY, preference);
    this.applyPreference(preference);
    this.notifyListeners();
  }

  getTheme(): 'light' | 'dark' | null {
    const preference = this.getPreference();
    if (preference === 'system') {
      return null;
    }
    return preference;
  }

  setTheme(theme: 'light' | 'dark') {
    this.setPreference(theme);
  }

  toggleTheme(): 'light' | 'dark' {
    const currentPreference = this.getPreference();
    const isDarkNow = currentPreference === 'dark' || 
                      (currentPreference === 'system' && this.mediaQuery.matches);
    
    const newTheme = isDarkNow ? 'light' : 'dark';
    this.setPreference(newTheme);
    return newTheme;
  }

  isDark(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  addListener(listener: ThemeListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const themeService = new ThemeService();
