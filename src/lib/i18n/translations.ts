import { getBrowserLang } from "@/lib/i18n/utils";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";

import zhTW from "./locales/zh-TW";
import zhCN from "./locales/zh-CN";
import ptBR from "./locales/pt-BR";
import vi from "./locales/vi";
import uk from "./locales/uk";
import tr from "./locales/tr";
import th from "./locales/th";
import sq from "./locales/sq";
import ru from "./locales/ru";
import ro from "./locales/ro";
import pt from "./locales/pt";
import pl from "./locales/pl";
import no from "./locales/no";
import nl from "./locales/nl";
import ne from "./locales/ne";
import ms from "./locales/ms";
import ko from "./locales/ko";
import ja from "./locales/ja";
import it from "./locales/it";
import id from "./locales/id";
import hu from "./locales/hu";
import hi from "./locales/hi";
import he from "./locales/he";
import fr from "./locales/fr";
import es from "./locales/es";
import en from "./locales/en";
import de from "./locales/de";
import da from "./locales/da";
import ca from "./locales/ca";
import be from "./locales/be";
import ar from "./locales/ar";


i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "zh-CN": { translation: zhCN },
    ja: { translation: ja },
    ko: { translation: ko },
    "zh-TW": { translation: zhTW },
    hi: { translation: hi },
    id: { translation: id },
    ms: { translation: ms },
    th: { translation: th },
    ne: { translation: ne },
    vi: { translation: vi },
    tr: { translation: tr },
    fr: { translation: fr },
    de: { translation: de },
    es: { translation: es },
    it: { translation: it },
    pt: { translation: pt },
    "pt-BR": { translation: ptBR },
    nl: { translation: nl },
    pl: { translation: pl },
    da: { translation: da },
    no: { translation: no },
    ro: { translation: ro },
    ca: { translation: ca },
    hu: { translation: hu },
    uk: { translation: uk },
    be: { translation: be },
    ru: { translation: ru },
    ar: { translation: ar },
    he: { translation: he },
    sq: { translation: sq },
  },
  lng: getBrowserLang(),
  fallbackLng: "zh-CN",
  interpolation: {
    escapeValue: false, // react 已经安全地处理了 HTML 转义
  },
})

export default i18n
