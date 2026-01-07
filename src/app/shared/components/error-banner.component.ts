import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  template: `
    <div class="error" role="alert">
      <p>{{ message }}</p>
      <button type="button" (click)="retry.emit()">Retry</button>
    </div>
  `,
  styles: [
    `
      .error {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border: 1px solid rgba(255, 92, 92, 0.4);
        border-radius: 0.75rem;
        background: rgba(255, 92, 92, 0.1);
      }

      p {
        margin: 0;
        color: #ffd6d6;
      }

      button {
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: transparent;
        color: inherit;
        padding: 0.4rem 0.8rem;
        border-radius: 999px;
        cursor: pointer;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorBannerComponent {
  @Input() message = 'Something went wrong.';
  @Output() retry = new EventEmitter<void>();
}
