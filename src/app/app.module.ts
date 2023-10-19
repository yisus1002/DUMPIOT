import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslationService } from './services/translate/translation.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Traduccion
export function translationInitializer(translationService: TranslationService) {
  return function () {
    return translationService.init(); // Se inicializa con el lenguage local del navegador
  };
}
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // NgxPermissionsModule.forChild(),
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2500,
      progressBar: true,
      enableHtml: true,
    }),
    TranslateModule.forRoot({
      defaultLanguage: window.navigator.language.split('-')[0],
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      },
    }),
  ],
  providers: [
    // { provide: LOCALE_ID, useValue: lang }
    // Servicio de traducción
    {
      provide: APP_INITIALIZER,
      useFactory: translationInitializer,
      deps: [TranslationService],
      multi: true
    }

  ],
  // schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
