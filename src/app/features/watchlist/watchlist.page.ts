import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WatchlistService } from './watchlist.service';
import { MovieCardComponent } from '../../shared/components/movie-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state.component';
import { MovieSummary } from '../../models/movie';

@Component({
  selector: 'app-watchlist-page',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, EmptyStateComponent],
  templateUrl: './watchlist.page.html',
  styleUrl: './watchlist.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistPage {
  readonly watchlist = inject(WatchlistService);

  trackById(_: number, movie: MovieSummary): number {
    return movie.id;
  }
}
