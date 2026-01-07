import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { MovieApiService } from '../../core/movie-api.service';
import { APP_CONFIG } from '../../core/app-config';
import { MovieDetails } from '../../models/movie';

export type DetailStatus = 'idle' | 'loading' | 'success' | 'error';

interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class DetailsFacade {
  private readonly api = inject(MovieApiService);
  private readonly config = inject(APP_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  readonly movieId = signal<number | null>(null);
  readonly status = signal<DetailStatus>('idle');
  readonly error = signal<string | null>(null);
  readonly details = signal<MovieDetails | null>(null);

  private readonly cache = new Map<number, CacheEntry<MovieDetails>>();

  constructor() {
    effect(() => {
      const id = this.movieId();
      if (!id) {
        this.status.set('idle');
        this.details.set(null);
        return;
      }

      void this.fetch(id);
    });
  }

  setMovieId(id: number | null): void {
    this.movieId.set(id);
  }

  retry(): void {
    const id = this.movieId();
    if (id) {
      void this.fetch(id, true);
    }
  }

  private async fetch(id: number, force = false): Promise<void> {
    const cached = this.cache.get(id);

    if (!force && cached && Date.now() - cached.timestamp < this.config.cacheTtlMs) {
      this.details.set(cached.data);
      this.status.set('success');
      return;
    }

    this.status.set('loading');
    this.error.set(null);

    try {
      const details = await this.api.getMovieDetails(id);
      this.cache.set(id, { timestamp: Date.now(), data: details });
      this.details.set(details);
      this.status.set('success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      this.error.set(message);
      this.status.set('error');
    }
  }
}
