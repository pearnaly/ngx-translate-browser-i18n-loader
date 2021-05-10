import {
  DEFAULT_LANGUAGE, DefaultLangChangeEvent, LangChangeEvent,
  MissingTranslationHandler,
  TranslateCompiler,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore, TranslationChangeEvent,
  USE_DEFAULT_LANG,
  USE_EXTEND,
  USE_STORE,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  EventEmitter, Inject, Injectable, InjectionToken,
} from '@angular/core';

/* function isDefined(value: unknown): boolean {
  return typeof value !== 'undefined' && value !== null;
} */

export const AVAILABLE_LANGUAGES = new InjectionToken<string[]>('AVAILABLE_LANGUAGES');

type Translation = { [key: string]: string };
type InterpolateParams = string | string[] | { [key: string]: string };

@Injectable()
export class TranslateBrowserI18nService {
  private readonly translateService: TranslateService;

  private readonly nativeLang: string;

  /* store: TranslateStore;

  currentLoader: TranslateLoader;

  compiler: TranslateCompiler;

  parser: TranslateParser;

  missingTranslationHandler: MissingTranslationHandler; */

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
    const applyDefaultLanguage = defaultLanguage || this.getExtensionDefaultLang();
    this.translateService = new TranslateService(
      store,
      currentLoader,
      compiler,
      parser,
      missingTranslationHandler,
      useDefaultLang,
      isolate,
      extend,
      applyDefaultLanguage,
    );

    this.nativeLang = this.getExtensionLang();
    console.debug('nativeLang:', this.nativeLang);
    // this.currentLang = this.nativeLang;
    // this.setDefaultLang(applyDefaultLanguage);
  }

  get onTranslationChange(): EventEmitter<TranslationChangeEvent> {
    return this.translateService.onTranslationChange;
  }

  get onLangChange(): EventEmitter<LangChangeEvent> {
    return this.translateService.onLangChange;
  }

  get onDefaultLangChange(): EventEmitter<DefaultLangChangeEvent> {
    return this.translateService.onDefaultLangChange;
  }

  set defaultLang(defaultLang: string) {
    this.translateService.defaultLang = defaultLang;
  }

  set currentLang(currentLang: string) {
    this.translateService.currentLang = currentLang;
  }

  set langs(langs: string[]) {
    this.translateService.langs = langs;
  }

  set translations(translations: Translation[]) {
    this.translateService.translations = translations;
  }

  setDefaultLang(lang: string): void {
    this.translateService.setDefaultLang(lang);
  }

  getDefaultLang(): string {
    return this.translateService.getDefaultLang();
  }

  use(lang: string): Observable<Translation> {
    return <Observable<Translation>> this.translateService.use(lang);
  }

  getTranslation(lang: string): Observable<Translation> {
    return <Observable<Translation>> this.translateService.getTranslation(lang);
  }

  setTranslation(lang: string, translations: Translation, shouldMerge?: boolean): void {
    this.translateService.setTranslation(lang, translations, shouldMerge);
  }

  getLangs(): string[] {
    return this.translateService.getLangs();
  }

  addLangs(langs: string[]): void {
    this.translateService.addLangs(langs);
  }

  getParsedResult(
    translations: Translation,
    key: string | string[],
    interpolateParams?: InterpolateParams,
  ): string | { [key: string]: string } {
    return <string | { [key: string]: string }> this.translateService
      .getParsedResult(translations, key, interpolateParams);
  }

  get(
    key: string | Array<string>,
    interpolateParams?: InterpolateParams,
  ): Observable<string | { [key: string]: string }> {
    return <Observable<string | { [key: string]: string }>> this.translateService
      .get(key, interpolateParams);
  }

  getStreamOnTranslationChange(
    key: string | Array<string>,
    interpolateParams?: InterpolateParams,
  ): Observable<string | { [key: string]: string }> {
    return <Observable<string | { [key: string]: string }>> this.translateService
      .getStreamOnTranslationChange(key, interpolateParams);
  }

  stream(
    key: string | Array<string>,
    interpolateParams?: InterpolateParams,
  ): Observable<string | { [key: string]: string }> {
    return <Observable<string | { [key: string]: string }>> this.translateService
      .stream(key, interpolateParams);
  }

  instant(
    key: string | Array<string>,
    interpolateParams?: InterpolateParams,
  ): string | { [key: string]: string } {
    return <string | { [key: string]: string }> this.translateService
      .instant(key, interpolateParams);
  }

  set(key: string, value: string, lang?: string): void {
    this.translateService.set(key, value, lang);
  }

  reloadLang(lang: string): Observable<Translation> {
    return <Observable<Translation>> this.translateService.reloadLang(lang);
  }

  resetLang(lang: string): void {
    this.translateService.resetLang(lang);
  }

  getBrowserLang(): string {
    // return this.translateService.getBrowserLang();
    return this.getBrowserCultureLang().replace(/-.*/, '');
  }

  getBrowserCultureLang(): string {
    // return this.translateService.getBrowserCultureLang();
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
