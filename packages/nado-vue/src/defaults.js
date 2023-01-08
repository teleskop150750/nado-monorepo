import { Components } from './components.js'
import { Icons } from './icons.js'
import { makeInstaller } from './make-installer.js'
import Plugins from './plugin.js'

export default makeInstaller([...Components, ...Icons, ...Plugins])
