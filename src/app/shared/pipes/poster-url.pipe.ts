import { Pipe, PipeTransform } from '@angular/core';
import { APP_CONFIG } from '../../core/app-config';
import { inject } from '@angular/core';

@Pipe({
  name: 'posterUrl',
  standalone: true
})
export class PosterUrlPipe implements PipeTransform {
  private readonly config = inject(APP_CONFIG);

  transform(path: string | null, size: 'w154' | 'w342' | 'w780' = 'w342'): string {
    if (!path) {
      return '';
    }

    return `${this.config.imageBase}/${size}${path}`;
  }
}
