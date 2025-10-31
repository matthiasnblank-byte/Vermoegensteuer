import { describe, it, expect, beforeEach, vi } from 'vitest';
import { themeService } from './themeService';

describe('ThemeService', () => {
  beforeEach(() => {
    // Clear localStorage und DOM
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  describe('getPreference / setPreference', () => {
    it('gibt "system" als Standard zurück', () => {
      expect(themeService.getPreference()).toBe('system');
    });

    it('speichert und lädt Light-Präferenz', () => {
      themeService.setPreference('light');
      expect(themeService.getPreference()).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('speichert und lädt Dark-Präferenz', () => {
      themeService.setPreference('dark');
      expect(themeService.getPreference()).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('speichert und lädt System-Präferenz', () => {
      themeService.setPreference('system');
      expect(themeService.getPreference()).toBe('system');
    });
  });

  describe('toggleTheme', () => {
    it('wechselt von light zu dark', () => {
      themeService.setPreference('light');
      const newTheme = themeService.toggleTheme();
      
      expect(newTheme).toBe('dark');
      expect(themeService.getPreference()).toBe('dark');
    });

    it('wechselt von dark zu light', () => {
      themeService.setPreference('dark');
      const newTheme = themeService.toggleTheme();
      
      expect(newTheme).toBe('light');
      expect(themeService.getPreference()).toBe('light');
    });
  });

  describe('isDark', () => {
    it('gibt true zurück wenn Dark Mode aktiv', () => {
      themeService.setPreference('dark');
      expect(themeService.isDark()).toBe(true);
    });

    it('gibt false zurück wenn Light Mode aktiv', () => {
      themeService.setPreference('light');
      expect(themeService.isDark()).toBe(false);
    });
  });

  describe('Listener', () => {
    it('benachrichtigt Listener bei Theme-Änderung', () => {
      const listener = vi.fn();
      const unsubscribe = themeService.addListener(listener);

      themeService.setPreference('dark');
      expect(listener).toHaveBeenCalledTimes(1);

      themeService.setPreference('light');
      expect(listener).toHaveBeenCalledTimes(2);

      unsubscribe();
    });

    it('entfernt Listener korrekt', () => {
      const listener = vi.fn();
      const unsubscribe = themeService.addListener(listener);

      unsubscribe();
      themeService.setPreference('dark');

      expect(listener).not.toHaveBeenCalled();
    });
  });
});



