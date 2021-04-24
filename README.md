# ngx-translate-browser-i18n-loader
Loads `_locale/<lang>/messages.json` translation files as defined by the browser.i18n (or chrome.i18n) api for browser extensions made with Angular and translated with [ngx-translate](https://github.com/ngx-translate/core)

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
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useClass: TranslateBrowserI18nLoader}
    })
  ],
  ...
})
export class AppModule {
}
```