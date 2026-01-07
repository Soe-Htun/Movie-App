import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieSummary } from '../../models/movie';
import { PosterUrlPipe } from '../pipes/poster-url.pipe';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink, PosterUrlPipe, DecimalPipe],
  template: `
    <article class="card">
      <a class="poster" [routerLink]="link">
        <ng-container *ngIf="movie.posterPath; else placeholder">
          <img
            [src]="movie.posterPath | posterUrl : 'w342'"
            [alt]="movie.title"
            loading="lazy"
            decoding="async"
            referrerpolicy="no-referrer"
          />
        </ng-container>
        <ng-template #placeholder>
          <div class="poster placeholder" aria-hidden="true"></div>
        </ng-template>
      </a>
      <div class="info">
        <div>
          <a [routerLink]="link" class="title">{{ movie.title }}</a>
          <p class="meta">
            <span>{{ year }}</span>
            <span class="dot">•</span>
            <span>{{ movie.voteAverage | number : '1.1-1' }}</span>
          </p>
        </div>
        <button
          *ngIf="showWatchlistAction"
          type="button"
          class="ghost"
          (click)="toggleWatchlist.emit()"
        >
          {{ inWatchlist ? 'Remove' : 'Watchlist' }}
        </button>
      </div>
    </article>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: rgba(255, 255, 255, 0.04);
        border-radius: 1rem;
        padding: 0.75rem;
        border: 1px solid rgba(255, 255, 255, 0.06);
      }

      .poster {
        display: block;
        border-radius: 0.75rem;
        overflow: hidden;
        aspect-ratio: 2 / 3;
        background: rgba(255, 255, 255, 0.08);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .placeholder {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
      }

      .info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 0.75rem;
      }

      .title {
        color: inherit;
        text-decoration: none;
        font-weight: 600;
      }

      .meta {
        margin: 0.25rem 0 0;
        color: var(--muted);
        font-size: 0.85rem;
        display: flex;
        gap: 0.35rem;
        align-items: center;
      }

      .dot {
        opacity: 0.5;
      }

      .ghost {
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: transparent;
        color: inherit;
        padding: 0.35rem 0.75rem;
        border-radius: 999px;
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: MovieSummary;
  @Input() link: string | any[] = '/';
  @Input() showWatchlistAction = false;
  @Input() inWatchlist = false;
  @Output() toggleWatchlist = new EventEmitter<void>();

  get year(): string {
    return this.movie.releaseDate ? this.movie.releaseDate.slice(0, 4) : '—';
  }
}
