import format from "date-fns/format";
import parse from "date-fns/parse";
import Site from "./Site";
import { defaultLocale } from "./locale";

// [GitHub](https://github.com/)
export default class GitHub extends Site {
  // eslint-disable-next-line class-methods-use-this
  replace(): void {
    // issueの書き込み時間
    GitHub.relativeTimes().forEach((relativeTime) => {
      if (relativeTime instanceof HTMLElement) {
        const title = relativeTime.getAttribute("title");
        if (title) {
          relativeTime.innerText = title;
        }
      }
    });
    // コミット履歴の区切り
    [...document.querySelectorAll(".TimelineItem-body > h2")].forEach(
      (commitGroupTitle) => {
        if (commitGroupTitle instanceof HTMLElement) {
          commitGroupTitle.innerText = commitGroupTitle.innerText.replace(
            /(Commits on )(\w+ \d+, \d+)/,
            (_, p1: string, p2: string) => {
              const parsed = parse(p2, "MMM d, y", new Date());
              return p1 + format(parsed, "PPP", { locale: defaultLocale });
            }
          );
        }
      }
    );
    // milestoneの期日
    // 使えそうなclassが設定されてないのでカレンダーアイコンから日時を辿る
    [...document.getElementsByClassName("octicon-calendar")].forEach(
      (svgOcticonCalendar) => {
        const iconParent = svgOcticonCalendar.parentElement;
        if (iconParent instanceof HTMLElement) {
          const milestoneMetaItem = iconParent.parentElement;
          if (milestoneMetaItem instanceof HTMLElement) {
            const textNode = milestoneMetaItem.lastChild;
            if (textNode instanceof Text) {
              const text = textNode.wholeText
                .trimEnd()
                .replace(
                  /(\s*Due by )(\w+ \d+, \d+)/,
                  (_, p1: string, p2: string) => {
                    const parsed = parse(p2, "MMMM d, y", new Date());
                    return (
                      p1 + format(parsed, "PPP", { locale: defaultLocale })
                    );
                  }
                );
              textNode.replaceWith(document.createTextNode(text));
            }
          }
        }
      }
    );
  }

  observe(): void {
    // GitHub固有のobserverを追加
    const observer = new MutationObserver((mutations): void => {
      mutations.forEach(() => {
        this.run();
      });
    });
    this.observers.push(observer);

    // GitHubはbody以下全部書き換えてページ遷移する(Turbolinks?)のでそれの監視
    [...document.getElementsByTagName("body")].forEach((body) => {
      if (body instanceof HTMLElement) {
        observer.observe(body, { childList: true });
      }
    });
    // issueの日時は何かのイベントで自動的に書き換わってしまうのでそれに対応
    // 全部検知して全部書き換えしているので無駄な処理が発生していますが
    // 所詮テキスト書き換えなのでそんなに重くないと思います
    // 重いと思ったのは無限ループが発生していたからですね
    GitHub.relativeTimes().forEach((relativeTime) => {
      observer.observe(relativeTime, { childList: true });
    });
  }

  // issueの日時など
  static relativeTimes(): Element[] {
    return [...document.getElementsByTagName("relative-time")];
  }
}
