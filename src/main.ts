// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideHttpClient } from '@angular/common/http';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideRouter, RouterModule } from '@angular/router';
// import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(),
//     provideAnimationsAsync(),
//     provideRouter(routes)
//   ]
// });

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment';

// טוען את config.json לפני העלאת האפליקציה
fetch('/assets/config.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load config.json: ${response.statusText}`);
    }
    return response.json();
  })
  .then(config => {
    // הגדרת apiUrl מתוך config.json
    environment.apiUrl = config.apiUrl || environment.apiUrl;

    // העלאת האפליקציה
    bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(),
        provideAnimationsAsync(),
        provideRouter(routes)
      ]
    }).catch(err => console.error(err));
  })
  .catch(err => {
    console.error('Error loading config.json:', err);

    // fallback אם הקובץ לא נטען
    bootstrapApplication(AppComponent, {
      providers: [
        provideHttpClient(),
        provideAnimationsAsync(),
        provideRouter(routes)
      ]
    }).catch(err => console.error(err));
  });
