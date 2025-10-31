const NAV_COLLAPSED_KEY = 'ui.nav.collapsed';

class NavService {
  /**
   * Liest den gespeicherten Navigation-Zustand
   */
  isCollapsed(): boolean {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem(NAV_COLLAPSED_KEY);
    return stored === 'true';
  }

  /**
   * Setzt den Navigation-Zustand
   */
  setCollapsed(collapsed: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NAV_COLLAPSED_KEY, String(collapsed));
  }

  /**
   * Toggelt den Navigation-Zustand
   */
  toggle(): boolean {
    const newState = !this.isCollapsed();
    this.setCollapsed(newState);
    return newState;
  }
}

export const navService = new NavService();
