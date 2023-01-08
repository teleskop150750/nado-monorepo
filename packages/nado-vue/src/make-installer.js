import { INSTALLED_KEY } from './constants/index.js'
import { version } from './version.js'

export const makeInstaller = (components = []) => {
  const install = (app) => {
    if (app[INSTALLED_KEY]) {
      return
    }

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c))
  }

  return {
    version,
    install,
  }
}
