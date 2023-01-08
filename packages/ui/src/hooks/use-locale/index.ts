import { computed, isRef, ref, unref, type Ref } from "vue";
import { get } from "lodash-es";
import { Russian } from "../../locale/lang/ru";
import type { MaybeRef } from "@vueuse/core";

type Language = typeof Russian;
export type Translator = (path: string) => string;

export type LocaleContext = {
  locale: Ref<Language>;
  lang: Ref<string>;
  t: Translator;
};

export const buildLocaleContext = (
  locale: MaybeRef<Language>
): LocaleContext => {
  const lang = computed(() => unref(locale).name);
  const localeRef = isRef(locale) ? locale : ref(locale);
  return {
    lang,
    locale: localeRef,
    t: (path: string) => get(Russian, path),
  };
};

export const useLocale = () => {
  return buildLocaleContext(computed(() => Russian));
};
