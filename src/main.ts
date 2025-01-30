import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './app/avrech/custom-paginator';
import { Directionality } from '@angular/cdk/bidi';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomPaginatorIntl },
    provideHttpClient(),
    provideAnimationsAsync(),
    provideRouter(routes)
  ]
});
