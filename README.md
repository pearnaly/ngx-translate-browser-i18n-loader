# ngx-translate-browser-i18n-loader
[![CI](https://github.com/pearnaly/ngx-translate-browser-i18n-loader/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/pearnaly/ngx-translate-browser-i18n-loader/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/%40pearnaly%2Fngx-translate-browser-i18n-loader.svg)](https://badge.fury.io/js/%40pearnaly%2Fngx-translate-browser-i18n-loader)

Loads `_locale/<lang>/messages.json` translation files as defined by the [browser.i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) (or [chrome.i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)) api for browser extensions made with Angular and translated with [ngx-translate](https://github.com/ngx-translate/core)

## Installation
```
npm install @pearnaly/ngx-translate-browser-i18n-loader
```

## Usage
Your translation files are supposed to be under `_locale/<lang>/messages.json` (ex `_locale/en_US/messages.json`), that's why the path is hardcoded (Still if you need it please let me know I can extend it).

You have two ways to use it:

### Extended service
The best way is to use the `TranslateBrowserI18nService` (extending the [TranslateService](https://github.com/ngx-translate/core/blob/master/projects/ngx-translate/core/src/lib/translate.service.ts)). This will use the browser native browser/chrome.i18n translation functionality which internally reads your translation files under `_locale/<lang>/messages.json`.
If you configure a different language than the browser one, then the native translation cannot be used, and the service will load (http) the appropriate translation file.
```typescript
@NgModule({
  ...
  imports: [
    ...
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateBrowserI18nLoader,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    ...
    { provide: TranslateService, useClass: NativeTranslateService },
    { provide: AVAILABLE_LANGUAGES, useValue: ['en', 'en-CA', 'de', 'fr', 'it'] },
  ],
  ...
})
export class AppModule {
}
```
The default used language will be the one of the browser, and the default default language will be the one from the extension manifest.
Provide the languages you support (directories under `_locale/` but with `-` instead of `_`). The service implements the same fallback mechanism as the browser: if you try to use 'en-GB' and if it's not available, if will fallback to 'en'.

### Loader only
If you don't want (or cannot) use the browser-native `browser/chrome.i18n` translation functionality, then just use the loader:

```typescript
@NgModule({
  ...
  imports: [
    ...
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslateBrowserI18nLoader,
        deps: [HttpClient]
      }
    })
  ],
  ...
})
export class AppModule {
}
```
In your language initialization, you can use [browser.i18n.getUILanguage()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n/getUILanguage) to load the current language of the browser.
