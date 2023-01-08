import { isClient } from '@vueuse/core'
import { computed, inject, unref } from 'vue'

import { debugWarn } from '../../utils/index.js'
import { defaultNamespace } from '../useNamespace/index.js'

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10_000),
  current: 0,
}

export const ID_INJECTION_KEY = Symbol('nIdInjection')

export const useId = (deterministicId) => {
  const idInjection = inject(ID_INJECTION_KEY, defaultIdInjection)

  if (!isClient && idInjection === defaultIdInjection) {
    debugWarn(
      'IdInjection',
      `Похоже, вы используете серверный рендеринг, вы должны указать поставщика идентификаторов, чтобы обеспечить успех процесса гидратации.
  Применение: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`,
    )
  }

  const namespace = defaultNamespace

  const idRef = computed(() => {
    idInjection.current += 1

    return unref(deterministicId) || `${namespace}-id-${idInjection.prefix}-${idInjection.current}`
  })

  return idRef
}
