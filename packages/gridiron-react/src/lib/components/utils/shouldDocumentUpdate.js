import util from 'util'

export default function shouldDocumentUpdate (obj, nextProps, nextState) {
  const hasDescendantProps = obj.props.children && obj.props.children.props
  const hasNextDescendantProps = nextProps.children && nextProps.children.props
  if(hasDescendantProps && hasNextDescendantProps) {
    return true
  }
  return true
}
