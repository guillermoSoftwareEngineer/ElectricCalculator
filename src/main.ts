import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // Si usas enrutamiento

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([]) // Configura el enrutamiento si es necesario
  ]
});
