export default function createInitialState({ React, ...deps }) {
  const { PropTypes } = React
  const InitialState = ({ serialize, stateKey = '__initialState__', globalKey, state }) => {

    const serialized = serialize(state, deps)
    const baseKey = globalKey ? `window.${globalKey}=window.${globalKey} || {};window.${globalKey}` : 'window'
    const __html = `${baseKey}.${stateKey}=${serialized}`
    return <script dangerouslySetInnerHTML={{ __html }} />
  }
  InitialState.propTypes = { serialize: PropTypes.func.isRequired }
  return InitialState
}

function createExecutor ({ React, ...deps }) {
  const { PropTypes } = React
  const Executor = ({ serialize, state, executeName }) => {
    const serialized = serialize(state, deps)
    const __html = `(function executor() { var __executionState=${serialized}; __executionState[${executeName}](__executionState); })()`
    return <script dangerouslySetInnerHTML={{ __html }} />
  }
  Executor.propTypes = { serialize: PropTypes.func.isRequired }
  return Executor
}

