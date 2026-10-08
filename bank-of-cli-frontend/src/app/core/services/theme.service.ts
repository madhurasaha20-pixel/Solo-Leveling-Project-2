import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type Appearance = 'light' | 'dark';

const STORAGE_KEY = 'bc-theme';

/**
 * Light/dark mode. 
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  
  /** The mode on screen. Dark unless the user saved light. */
  readonly appearance = signal<Appearance>(this.readSaved());  

  constructor() {
    this.apply(this.appearance());
  }

  set(mode: Appearance): void {
    this.appearance.set(mode);
    this.apply(mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* storage blocked: still works for this visit */ }
  }

    private apply(mode: Appearance): void {
    this.root.setAttribute('data-theme', mode);
  }

  private readSaved(): Appearance {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    } catch {
      return 'dark';
    }
  }
}