import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { AuthService } from '../core/services/auth.service';
import { PageHeadingComponent } from '../shared/ui/page-heading.component';

/** Heading-only route shell; feature owners can place their content below it. */
@Component({
  selector: 'app-page-shell',
  imports: [AsyncPipe, PageHeadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (heading$ | async; as heading) {
      <bc-page-heading [title]="heading.title" [description]="heading.description" />
    }
  `,
})
export class PageShellComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  protected readonly heading$ = combineLatest([this.route.data, this.auth.currentUser$]).pipe(
    map(([data, user]) => ({
      title: data['greeting'] && user ? `Welcome back, ${user.name.trim().split(/\s+/)[0]}` : data['title'] as string,
      description: data['description'] as string,
    })),
  );
}
