# ngx-translate-browser-i18n-loader
Loads `_locale/<lang>/messages.json` translation files as defined by the [browser.i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n) (or [chrome.i18n](https://developer.chrome.com/docs/extensions/reference/i18n/)) api for browser extensions made with Angular and translated with [ngx-translate](https://github.com/ngx-translate/core)

## Installation
```
npm install @pearnaly/ngx-translate-browser-i18n-loader
```

## Usage
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
Your translation files are supposed to be under `_locale/<lang>/messages.json` (ex `_locale/en_US/messages.json`), that's why the path is hardcoded (Still if you need it please let me know I can extend it).

In your language initialization, you can use [browser.i18n.getUILanguage()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n/getUILanguage) to load the current language of the browser.
