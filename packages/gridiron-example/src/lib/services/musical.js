import { IS_BROWSER } from '../../config'
module.exports = IS_BROWSER ? require('./musical.browser') : {}
