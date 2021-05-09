import {
  DEFAULT_LANGUAGE,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Inject, Injectable, InjectionToken } from '@angular/core';

function isDefined(value: unknown): boolean {
  return typeof value !== 'undefined' && value !== null;
}

export const AVAILABLE_LANGUAGES = new InjectionToken<string[]>('AVAILABLE_LANGUAGES');

@Injectable()
export class TranslateBrowserI18nService extends TranslateService {
  private readonly nativeLang: string;

  constructor(
    store: TranslateStore,
    currentLoader: TranslateLoader,
    compiler: TranslateCompiler,
    parser: TranslateParser,
    missingTranslationHandler: MissingTranslationHandler,
    @Inject(USE_DEFAULT_LANG) useDefaultLang = true,
    @Inject(USE_STORE) isolate = false,
    @Inject(USE_EXTEND) extend = false,
    @Inject(DEFAULT_LANGUAGE) defaultLanguage: string,
    @Inject(AVAILABLE_LANGUAGES) private availableLanguages: string,
  ) {
    super(
      store,
      currentLoader,
      compiler,
      parser,
      missingTranslationHandler,
      useDefaultLang,
      isolate,
      extend,
      null,
    );
    const applyDefaultLanguage = defaultLanguage || this.getExtensionDefaultLang();
    this.nativeLang = this.getExtensionLang();
    this.currentLang = this.nativeLang;
    this.setDefaultLang(applyDefaultLanguage);
  }

  get(
    key: string | Array<string>,
    interpolateParams?: string | string[] | { [key: string]: string },
  ): Observable<string | { [key: string]: string }> {
    if (!isDefined(key) || !key.length) {
      throw new Error('Parameter "key" required');
    }
    if (this.currentLang === this.nativeLang) {
      return of(this.getNativeMessages(key, interpolateParams));
    }
    return <Observable<string | { [key: string]: string }>> super.get(key, interpolateParams);
  }

  instant(
    key: string | Array<string>,
    interpolateParams?: string | string[] | { [key: string]: string },
  ): string | { [key: string]: string } {
    if (!isDefined(key) || !key.length) {
      throw new Error('Parameter "key" required');
    }
    if (this.currentLang === this.nativeLang) {
      return this.getNativeMessages(key, interpolateParams);
    }
    return <string | { [key: string]: string }> super.instant(key, interpolateParams);
  }

  private getNativeMessages(
    key: string | string[],
    interpolateParams: string | string[] | { [key: string]: string },
  ): string | { [key: string]: string } {
    let nativeInterpolateParams: string | string[];
    if (!isDefined(interpolateParams)) {
      nativeInterpolateParams = null;
    } else if (typeof interpolateParams === 'string' || interpolateParams instanceof Array) {
      nativeInterpolateParams = interpolateParams;
    } else {
      nativeInterpolateParams = Object.keys(interpolateParams)
        .map((interpoKey) => interpolateParams[interpoKey]);
    }
    if (key instanceof Array) {
      const result: { [key: string]: string } = {};
      key.forEach((k) => {
        result[k] = this.getNativeMessage(k, nativeInterpolateParams);
      });
      return result;
    }
    return this.getNativeMessage(key, nativeInterpolateParams);
  }

  private getNativeMessage(key: string, interpolateParams: string | string[]): string {
    return browser.i18n.getMessage(key, interpolateParams);
  }

  setDefaultLang(lang: string): void {
    if (lang === this.getExtensionDefaultLang() && this.currentLang === this.nativeLang) {
      if (this.defaultLang !== lang) {
        this.defaultLang = lang;
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.changeDefaultLang(this.defaultLang);
      }
      return;
    }
    if (this.defaultLang === this.getExtensionDefaultLang()) {
      this.defaultLang = null; // to trigger change
    }
    super.setDefaultLang(lang);
  }

  use(lang: string): Observable<unknown> {
    if (this.getClosestAvailableOverLang(lang) === this.nativeLang) {
      if (this.nativeLang !== this.currentLang) {
        this.currentLang = this.nativeLang;
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        this.changeLang(this.currentLang);
      }
      return of(null);
    }
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const retrieveDefault = <Observable<unknown>> this.retrieveTranslations(this.defaultLang);
    const useObs = super.use(lang);
    if (retrieveDefault) {
      return combineLatest([useObs, retrieveDefault]);
    }
    return useObs;
  }

  getBrowserLang(): string {
    return this.getBrowserCultureLang().replace(/-.*/, '');
  }

  getBrowserCultureLang(): string {
    return browser.i18n.getUILanguage();
  }

  getExtensionDefaultLang(): string {
    return browser.runtime.getManifest().default_locale.replace(/_/g, '-');
  }

  getExtensionLang(): string {
    const uiLanguage = this.getBrowserCultureLang(); // ex: en-US or it

    return this.getClosestAvailableOverLang(uiLanguage) || this.getExtensionDefaultLang();
  }

  getClosestAvailableOverLang(lang: string): string {
    if (this.availableLanguages.includes(lang)) {
      return lang;
    }

    const iso639language = lang.replace(/-.*/, ''); // ex: en
    if (this.availableLanguages.includes(iso639language)) {
      return iso639language;
    }

    return null;
  }
}
