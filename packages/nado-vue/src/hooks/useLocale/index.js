import { Russian } from '../../locale/lang/ru.js'

export const buildLocaleContext = (locale) => {
  const lang = locale.name

  return {
    lang,
    locale,
  }
}

export const useLocale = () => buildLocaleContext(Russian)
