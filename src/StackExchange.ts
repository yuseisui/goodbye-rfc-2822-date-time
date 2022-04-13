import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import Site from "./Site";
import { defaultLocale } from "./locale";

// [Hot Questions - Stack Exchange](https://stackexchange.com/)
export default class StackExchange extends Site {
  // eslint-disable-next-line class-methods-use-this
  replace(): void {
    // エントリーの投稿日時
    [...document.querySelectorAll(".relativetime")].forEach((relativeTime) => {
      if (relativeTime instanceof HTMLElement) {
        const title = relativeTime.getAttribute("title");
        if (title == null) {
          return;
        }
        const parsed = parseISO(title);
        if (isValid(parsed)) {
          relativeTime.innerText = format(parsed, "PPPpp", {
            locale: defaultLocale,
          });
        }
      }
    });
    // コメントの投稿日時
    [...document.querySelectorAll(".relativetime-clean")].forEach(
      (relativeTime) => {
        if (relativeTime instanceof HTMLElement) {
          const t = relativeTime.getAttribute("title")?.match(/.+Z/)?.[0];
          if (t == null) {
            return;
          }
          const parsed = parseISO(t);
          if (isValid(parsed)) {
            relativeTime.innerText = format(parsed, "PPPpp", {
              locale: defaultLocale,
            });
          }
        }
      }
    );
  }

  // eslint-disable-next-line class-methods-use-this
  observe(): void {
    // do nothing
  }
}
