import { computed } from 'vue'

import { vmHasRouter } from '../../utils/index.js'
import { getCurrentInstance } from '../getCurrentInstance/index.js'

/**
 * Get the original path value of a record by following its aliasOf
 *
 * @param {Object} record
 */
function getOriginalPath(record) {
  return record ? (record.aliasOf ? record.aliasOf.path : record.path) : ''
}

/**
 * @param {Object} a
 * @param {Object} b
 */
function isSameRouteRecord(a, b) {
  // Поскольку исходная запись имеет неопределенное значение для aliasOf,
  // но все псевдонимы указывают на исходную запись,
  // всегда будет сравниваться исходная запись.
  return (a.aliasOf || a) === (b.aliasOf || b)
}

/**
 * @param {Object} outer
 * @param {Object} inner
 */
function includesParams(outer, inner) {
  Object.keys(inner).forEach((key) => {
    const innerValue = inner[key]
    const outerValue = outer[key]

    if (typeof innerValue === 'string') {
      if (innerValue !== outerValue) {
        return false
      }
    } else if (
      Array.isArray(outerValue) === false ||
      outerValue.length !== innerValue.length ||
      innerValue.some((value, i) => value !== outerValue[i])
    ) {
      return false
    }
  })

  return true
}

/**
 * @param {Object} a
 * @param {Object} b
 */
function isEquivalentArray(a, b) {
  return Array.isArray(b) === true
    ? a.length === b.length && a.every((value, i) => value === b[i])
    : a.length === 1 && a[0] === b
}

function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) === true
    ? isEquivalentArray(a, b)
    : Array.isArray(b) === true
    ? isEquivalentArray(b, a)
    : a === b
}

/**
 * @param {Object} a
 * @param {Object} b
 */
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false
  }

  Object.keys(a).forEach((key) => {
    if (isSameRouteLocationParamsValue(a[key], b[key]) === false) {
      return false
    }
  })

  return true
}

export const useRouterLinkProps = {
  // Router-link
  to: {
    type: [String, Object],
    default: '',
  },
  replace: {
    type: Boolean,
    default: false,
  },
  append: {
    type: Boolean,
    default: false,
  },
  exact: {
    type: Boolean,
    default: false,
  },
  activeClass: {
    type: String,
    default: 'active',
  },
  exactActiveClass: {
    type: String,
    default: 'exact-active',
  },

  // Regular <a> link
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String,
    default: '',
  },

  // State
  disabled: {
    type: Boolean,
    default: false,
  },
}

export function useRouterLink({ fallbackTag = 'div', useDisableForRouterLinkProps = true } = {}) {
  const vm = getCurrentInstance('useRouterLink')

  /**
   * @type {{
   *  props: Object
   *  proxy: import('vue').ComponentPublicInstance,
   *  emit: (evt: string, ...args: any[]) => void
   * }}
   */
  const { props, proxy, emit } = vm

  const hasRouter = vmHasRouter(vm)
  const hasHrefLink = computed(() => props.disabled !== true && props.href !== '')

  // По соображениям производительности мы используем
  // минимальный объем работы во время выполнения
  const hasRouterLinkProps =
    useDisableForRouterLinkProps === true
      ? computed(
          () =>
            hasRouter === true &&
            props.disabled !== true &&
            hasHrefLink.value !== true &&
            props.to !== '' &&
            props.to !== null &&
            props.to !== undefined,
        )
      : computed(
          () =>
            hasRouter === true &&
            hasHrefLink.value !== true &&
            props.to !== '' &&
            props.to !== null &&
            props.to !== undefined,
        )

  const resolvedLink = computed(() => (hasRouterLinkProps.value === true ? getLink(props.to) : null))

  const hasRouterLink = computed(() => resolvedLink.value !== null)
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true)

  /** @type {import('vue').ComputedRef} */
  const linkTag = computed(() =>
    props.type === 'a' || hasLink.value === true ? 'a' : props.tag || fallbackTag || 'div',
  )

  const linkAttrs = computed(() =>
    hasHrefLink.value === true
      ? {
          href: props.href,
          target: props.target,
        }
      : hasRouterLink.value === true
      ? {
          href: resolvedLink.value.href,
          target: props.target,
        }
      : {},
  )

  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return -1
    }

    const { matched } = resolvedLink.value
    const { length } = matched
    const routeMatched = matched[length - 1]

    if (routeMatched === undefined) {
      return -1
    }

    const currentMatched = proxy.$route.matched

    if (currentMatched.length === 0) {
      return -1
    }

    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched))

    if (index > -1) {
      return index
    }

    // Possible parent record
    const parentRecordPath = getOriginalPath(matched[length - 2])

    return (
      // We are dealing with nested routes
      length > 1 &&
        // If the parent and matched route have the same path, this link is
        // referring to the empty child. Or we currently are on a different
        // child of the same parent
        getOriginalPath(routeMatched) === parentRecordPath &&
        // Avoid comparing the child with its parent
        currentMatched.at(-1).path !== parentRecordPath
        ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2]))
        : index
    )
  })

  const linkIsActive = computed(
    () =>
      hasRouterLink.value === true &&
      linkActiveIndex.value !== -1 &&
      includesParams(proxy.$route.params, resolvedLink.value.params),
  )

  const linkIsExactActive = computed(
    () =>
      linkIsActive.value === true &&
      linkActiveIndex.value === proxy.$route.matched.length - 1 &&
      isSameRouteLocationParams(proxy.$route.params, resolvedLink.value.params),
  )

  const linkClass = computed(() => {
    if (hasRouterLink.value !== true) {
      return ''
    }

    if (linkIsExactActive.value === true) {
      return ` ${props.exactActiveClass} ${props.activeClass}`
    }

    if (props.exact === true) {
      return ''
    }

    return linkIsActive.value === true ? ` ${props.activeClass}` : ''
  })

  function getLink(to) {
    try {
      return proxy.$router.resolve(to)
    } catch {
      // Продолжать независимо от ошибки
    }

    return null
  }

  /**
   * @returns Promise<RouterError | false | undefined>
   */
  function navigateToRouterLink(evt, { returnRouterError = false, to = props.to, replace = props.replace } = {}) {
    if (props.disabled === true) {
      // Убедитесь, что встроенная навигация запрещена во всех случаях;
      // например, когда useDisableForRouterLinkProps === false
      evt.preventDefault()

      return Promise.resolve(false)
    }

    if (
      // Не перенаправляйте с помощью управляющих клавиш;
      // должно соответствовать RouterLink от Vue Router
      evt.metaKey ||
      evt.altKey ||
      evt.ctrlKey ||
      evt.shiftKey ||
      // Не перенаправляйте при щелчке правой кнопкой мыши
      (evt.button !== undefined && evt.button !== 0) ||
      // Не перенаправляйте, если он должен открыться в новом окне
      props.target === '_blank'
    ) {
      return Promise.resolve(false)
    }

    // Препятствуют родной навигации
    evt.preventDefault()

    // Then() также может возвращать "soft" router error (Vue Router behavior)
    const promise = proxy.$router[replace === true ? 'replace' : 'push'](to)

    return returnRouterError === true
      ? promise
      : // Else catching hard errors а также "soft" ones - then(err => ...)
        // eslint-disable-next-line promise/always-return
        promise.then(() => {}).catch(() => {})
  }

  // Warning! ensure that the component using it has 'click' included in its 'emits' definition prop
  /**
   * @param {Event} evt
   */
  function navigateOnClick(evt) {
    if (hasRouterLink.value === true) {
      /** @param {Object} opts */
      const go = (opts) => navigateToRouterLink(evt, opts)

      emit('click', evt, go)
      evt.defaultPrevented !== true && go()
    } else {
      emit('click', evt)
    }
  }

  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,

    linkTag,
    resolvedLink,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkAttrs,

    getLink,
    navigateToRouterLink,
    navigateOnClick,
  }
}
