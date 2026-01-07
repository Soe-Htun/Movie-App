import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchFacade } from './search.facade';
import { MovieCardComponent } from '../../shared/components/movie-card.component';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { ErrorBannerComponent } from '../../shared/components/error-banner.component';
import { WatchlistService } from '../watchlist/watchlist.service';
import { MovieSummary } from '../../models/movie';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieCardComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    ErrorBannerComponent
  ],
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly facade = inject(SearchFacade);
  readonly watchlist = inject(WatchlistService);

  query = '';
  year = '';
  minRating = '';

  private syncTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer);
      }
    });

    this.applyParams(this.route.snapshot.queryParamMap);

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => this.applyParams(params));
  }

  onFiltersChange(): void {
    this.facade.setFilters(
      this.query,
      this.parseNumber(this.year),
      this.parseNumber(this.minRating)
    );
    this.scheduleQuerySync();
  }

  trackById(_: number, movie: MovieSummary): number {
    return movie.id;
  }

  private parseNumber(value: string): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) && value !== '' ? parsed : null;
  }

  private applyParams(params: ParamMap): void {
    this.query = params.get('q') ?? '';
    this.year = params.get('year') ?? '';
    this.minRating = params.get('minRating') ?? '';

    this.facade.setFilters(
      this.query,
      this.parseNumber(this.year),
      this.parseNumber(this.minRating)
    );
  }

  private scheduleQuerySync(): void {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer);
    }

    this.syncTimer = setTimeout(() => {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          q: this.query || null,
          year: this.year || null,
          minRating: this.minRating || null
        }
      });
    }, 300);
  }
}
