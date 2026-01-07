import { Injectable, signal } from '@angular/core';
import { MovieSummary } from '../../models/movie';

export interface WatchlistItem extends MovieSummary {
  addedAt: number;
}

const STORAGE_KEY = 'movie-app.watchlist';

@Injectable({ providedIn: 'root' })
export class WatchlistService {
  private readonly itemsSignal = signal<WatchlistItem[]>(this.load());
  readonly items = this.itemsSignal.asReadonly();

  toggle(movie: MovieSummary): void {
    const items = this.itemsSignal();
    const exists = items.find((item) => item.id === movie.id);

    if (exists) {
      this.setItems(items.filter((item) => item.id !== movie.id));
      return;
    }

    this.setItems([
      { ...movie, addedAt: Date.now() },
      ...items
    ]);
  }

  remove(id: number): void {
    this.setItems(this.itemsSignal().filter((item) => item.id !== id));
  }

  has(id: number): boolean {
    return this.itemsSignal().some((item) => item.id === id);
  }

  private setItems(items: WatchlistItem[]): void {
    this.itemsSignal.set(items);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  private load(): WatchlistItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as WatchlistItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
