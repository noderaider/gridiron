import pureStamp from 'pure-stamp'
import gridiron, { deps } from './gridiron'
import IdleMonitor from './components/IdleMonitor'

export default pureStamp({ ...deps, gridiron, IdleMonitor }, {})
