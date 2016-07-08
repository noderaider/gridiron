import { minify } from 'uglify-js'
export default content => minify(content, { fromString: true }).code
