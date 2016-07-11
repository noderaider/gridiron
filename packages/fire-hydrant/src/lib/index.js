import createFireHydrant from './createFireHydrant'
import createImmutableSerializer from './serializers/createImmutableSerializer'
import createInitialState from './react/createInitialState'

const { toHydrant, fromHydrant, serialize, deserialize } = createFireHydrant({ serializers: [ createImmutableSerializer() ] })
export { toHydrant, fromHydrant, serialize, deserialize, createInitialState }
