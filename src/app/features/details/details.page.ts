import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DetailsFacade } from './details.facade';
import { LoadingStateComponent } from '../../shared/components/loading-state.component';
import { ErrorBannerComponent } from '../../shared/components/error-banner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { PosterUrlPipe } from '../../shared/pipes/poster-url.pipe';
import { WatchlistService } from '../watchlist/watchlist.service';
import { MovieCardComponent } from '../../shared/components/movie-card.component';
import { MovieSummary } from '../../models/movie';

@Component({
  selector: 'app-details-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PosterUrlPipe,
    LoadingStateComponent,
    ErrorBannerComponent,
    EmptyStateComponent,
    MovieCardComponent
  ],
  templateUrl: './details.page.html',
  styleUrl: './details.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly facade = inject(DetailsFacade);
  readonly watchlist = inject(WatchlistService);

  constructor() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const rawId = params.get('id');
        const id = rawId ? Number(rawId) : null;
        this.facade.setMovieId(Number.isFinite(id) ? id : null);
      });
  }

  trackById(_: number, movie: MovieSummary): number {
    return movie.id;
  }

  get year(): string {
    const details = this.facade.details();
    return details?.releaseDate ? details.releaseDate.slice(0, 4) : '—';
  }
}
