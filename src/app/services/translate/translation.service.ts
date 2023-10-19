import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private systemLan = window.navigator.language.split('-')[0];
  private languages = ['es', 'en'];

  constructor(private translateService: TranslateService) {
  }

  init(locale = this.systemLan): void {
    if (locale !== 'en' && locale !== 'es') {
      locale = 'es';
    }
    this.translateService.addLangs(this.languages);
    this.translateService.use(locale);
  }

  cambiarLenguage(lan: string): void {
    this.translateService.use(lan);
  }

  getLanguagesDisponibles(): string[] {
    return this.languages;
  }

  getTraduccion(value: string): Observable<string> {
    return this.translateService.get(value);
  }

  getLanguageUsing(): string {
    return this.translateService.getDefaultLang()
  }
}
