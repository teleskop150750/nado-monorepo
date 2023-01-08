import { computed } from 'vue'

import { useDisabled, useRouterLink } from '../../../hooks/index.js'

const mediaTypeRE = /\S\/\S/u

export function useButton(props) {
  const { hasRouterLink, hasLink, linkTag, linkAttrs, navigateOnClick } = useRouterLink({
    fallbackTag: 'button',
  })
  const disabled = useDisabled()

  const actionable = computed(() => disabled.value !== true && props.loading !== true)

  const tabIndex = computed(() => (actionable.value === true ? props.tabindex : -1))

  const attributes = computed(() => {
    const acc = {
      tabindex: tabIndex.value,
      type: props.type,
    }

    if (hasLink.value === true) {
      Object.assign(acc, linkAttrs.value)
    }

    if (linkTag.value === 'a') {
      if (disabled.value === true) {
        acc['aria-disabled'] = 'true'
      } else if (acc.href === '') {
        acc.role = 'button'
      }

      if (hasRouterLink.value !== true && mediaTypeRE.test(props.type) === true) {
        acc.type = props.type
      }
    } else if (disabled.value === true) {
      acc.disabled = ''
      acc['aria-disabled'] = 'true'
    }

    return acc
  })

  return {
    disabled,
    actionable,
    tabIndex,
    attributes,
    hasLink,
    linkTag,
    navigateOnClick,
  }
}
