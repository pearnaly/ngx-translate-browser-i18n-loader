import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Message, Messages } from './browser-i18n';

type Translate = {
  [key: string]: string
};

export default class TranslateBrowserI18nLoader implements TranslateLoader {
  constructor(
    protected httpClient: HttpClient,
  ) {
  }

  // eslint-disable-next-line class-methods-use-this
  getTranslation(lang: string): Observable<Translate> {
    const langDirName = lang.replace(/-/g, '_');
    const url = `/_locales/${langDirName}/messages.json`;
    return this.httpClient
      .get(url)
      .pipe(
        map((messages: Messages) => {
          const translate: Translate = {};
          Object.keys(messages)
            .forEach((key: string) => {
              translate[key] = TranslateBrowserI18nLoader.getTranslationString(messages[key]);
            });
          return translate;
        }),
      );
  }

  private static getTranslationString(message: Message): string {
    let messageStr = message.message;
    Object.keys(message.placeholders || [])
      .forEach((key: string) => {
        let { content } = message.placeholders[key];
        content = content.replace(/\$1/g, `{{${key}}}`);
        messageStr = messageStr.replace(new RegExp(`\\$${key}\\$`, 'ig'), content);
      });
    return messageStr;
  }
}
