import { DOCUMENT } from '@angular/common';
import { Injectable, computed, inject, signal } from '@angular/core';

export type Appearance = 'light' | 'dark';

const STORAGE_KEY = 'bc-theme';

/**
 * Light/dark mode. 
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly deviceQuery = matchMedia('(prefers-color-scheme: dark)');

  /** The user's saved pick, or null when following the device. */
  readonly pick = signal<Appearance | null>(this.readSaved());
  private readonly deviceMode = signal<Appearance>(this.deviceQuery.matches ? 'dark' : 'light');

  /** The mode actually on screen. */
  readonly appearance = computed(() => this.pick() ?? this.deviceMode());

  constructor() {
    this.deviceQuery.addEventListener('change', e => this.deviceMode.set(e.matches ? 'dark' : 'light'));
    this.apply(this.pick());
  }

  set(mode: Appearance): void {
    this.pick.set(mode);
    this.apply(mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { /* storage blocked: still works for this visit */ }
  }

  private apply(mode: Appearance | null): void {
    if (mode) this.root.setAttribute('data-theme', mode);
    else this.root.removeAttribute('data-theme');
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