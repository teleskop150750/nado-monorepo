import { NOOP } from '@vue/shared'

/**
 * @param {any} main
 * @param {{ [s: string]: any; }} extra
 */
export const withInstall = (main, extra = null) => {
  /** @param {{ component: (arg0: any, arg1: any) => void; }} app */
  main.install = (app) => {
    ;[main, ...Object.values(extra ?? {})].forEach((comp) => {
      app.component(comp.name, comp)
    })
  }

  if (extra) {
    Object.entries(extra).forEach(([key, comp]) => {
      main[key] = comp
    })
  }

  return main
}

/**
 * @param {any} fn
 * @param {string | number} name
 */
export const withInstallFunction = (fn, name) => {
  fn.install = (app) => {
    fn._context = app._context
    app.config.globalProperties[name] = fn
  }

  return fn
}

/**
 * @param {any} directive
 * @param {string | number} name
 */
export const withInstallDirective = (directive, name) => {
  directive.install = (/** @type {{ directive: (arg0: any, arg1: any) => void; }} */ app) => {
    app.directive(name, directive)
  }

  return directive
}

export const withNoopInstall = (component) => {
  component.install = NOOP

  return component
}
