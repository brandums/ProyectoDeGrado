import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

(window as any).onloadCallback = () => {
  grecaptcha.render('recaptcha-element', {
    sitekey: '6Le6RScqAAAAAJ2BPfa0I0Vm8EsNsaNhQsDBZBqZ',
    callback: (response: string) => {
    }
  });
};
