import { AppLayoutToFileMap } from '../../layouts/layouts.js'

export async function loadLayout(route) {
  const { layout } = route.meta
  const normalizedLayoutName = layout || 'default'
  const fileName = AppLayoutToFileMap[normalizedLayoutName]
  const [fileNameWithoutExtension] = fileName.split('.vue')

  const component = await import(`../../layouts/${fileNameWithoutExtension}.vue`)

  route.meta.layoutComponent = component.default
}
