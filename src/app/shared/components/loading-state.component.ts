import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ label }}</span>
    </div>
  `,
  styles: [
    `
      .loading {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--muted);
      }

      .spinner {
        width: 1rem;
        height: 1rem;
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        border-top-color: var(--accent);
        animation: spin 0.9s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStateComponent {
  @Input() label = 'Loading...';
}
