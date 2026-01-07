import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { MovieApiService } from '../../core/movie-api.service';
import { APP_CONFIG } from '../../core/app-config';
import { SearchResult } from '../../models/movie';

export type LoadStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

function createDebouncedSignal<T>(
  source: () => T,
  delayMs: number,
  destroyRef: DestroyRef
) {
  const debounced = signal(source());
  let timer: ReturnType<typeof setTimeout> | null = null;

  destroyRef.onDestroy(() => {
    if (timer) {
      clearTimeout(timer);
    }
  });

  effect(() => {
    const value = source();
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => debounced.set(value), delayMs);
  });

  return debounced.asReadonly();
}

@Injectable({ providedIn: 'root' })
export class SearchFacade {
  private readonly api = inject(MovieApiService);
  private readonly config = inject(APP_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  readonly query = signal('');
  readonly year = signal<number | null>(null);
  readonly minRating = signal<number | null>(null);
  readonly page = signal(1);

  readonly status = signal<LoadStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly results = signal<SearchResult['results']>([]);
  readonly totalResults = signal(0);
  readonly totalPages = signal(0);
  readonly loadingMore = signal(false);

  private readonly cache = new Map<string, CacheEntry<SearchResult>>();
  private readonly debouncedQuery = createDebouncedSignal(this.query, 300, this.destroyRef);

  constructor() {
    effect(() => {
      const query = this.debouncedQuery().trim();
      const year = this.year();
      const minRating = this.minRating();
      const page = this.page();

      if (!query) {
        this.reset();
        return;
      }

      void this.fetch(query, year, minRating, page);
    });
  }

  setFilters(query: string, year: number | null, minRating: number | null): void {
    this.query.set(query);
    this.year.set(year);
    this.minRating.set(minRating);
    this.page.set(1);
  }

  loadMore(): void {
    if (this.page() < this.totalPages()) {
      this.page.update((page) => page + 1);
    }
  }

  retry(): void {
    const query = this.query();
    if (!query.trim()) {
      return;
    }
    void this.fetch(query.trim(), this.year(), this.minRating(), this.page(), true);
  }

  private reset(): void {
    this.status.set('idle');
    this.error.set(null);
    this.results.set([]);
    this.totalResults.set(0);
    this.totalPages.set(0);
    this.loadingMore.set(false);
  }

  private async fetch(
    query: string,
    year: number | null,
    minRating: number | null,
    page: number,
    force = false
  ): Promise<void> {
    const key = JSON.stringify({ query, year, minRating, page });
    const cached = this.cache.get(key);

    if (!force && cached && Date.now() - cached.timestamp < this.config.cacheTtlMs) {
      this.applyResults(cached.data, page > 1);
      return;
    }

    this.error.set(null);

    if (page > 1) {
      this.loadingMore.set(true);
    } else {
      this.status.set('loading');
    }

    try {
      const result = await this.api.searchMovies(query, year, minRating, page);
      this.cache.set(key, { timestamp: Date.now(), data: result });
      this.applyResults(result, page > 1);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      this.error.set(message);
      this.status.set('error');
      this.loadingMore.set(false);
    }
  }

  private applyResults(result: SearchResult, append: boolean): void {
    const nextResults = append ? [...this.results(), ...result.results] : result.results;
    this.results.set(nextResults);
    this.totalResults.set(result.totalResults);
    this.totalPages.set(result.totalPages);
    this.loadingMore.set(false);

    if (nextResults.length === 0) {
      this.status.set('empty');
      return;
    }

    this.status.set('success');
  }
}
