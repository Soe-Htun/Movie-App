import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty" role="status" aria-live="polite">
      <p>{{ message }}</p>
    </div>
  `,
  styles: [
    `
      .empty {
        padding: 1rem;
        border-radius: 0.75rem;
        border: 1px dashed rgba(255, 255, 255, 0.15);
        color: var(--muted);
      }

      p {
        margin: 0;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
  @Input() message = 'No results found.';
}
