import cn from 'classnames'
import raf from 'raf'
import grid from './grid'
import column from './column/index'
import util from 'util'

export default function accordion (pure) {
  const { React
        , PropTypes
        , cloneElement
        , shallowCompare
        , Immutable
        , Pre
        , formula
        , defaults
        } = pure

  const Grid = grid(pure)
  const ZERO_MEASURES = [ null, '', 0, '0', '0px' ]

  return pure (
    { displayName: 'Accordion'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , mapHeader: PropTypes.func.isRequired
                  , mapContent: PropTypes.func.isRequired
                  , data: PropTypes.object.isRequired
                  , expandedDocumentID: PropTypes.any
                  , transitionDurationMS: PropTypes.number
                  }
    , defaultProps: { ...defaults
                    }
    , init() {
        this.contents = {}
        this.expanded = null
        this.toggleDocument = documentID => {
          const node = this.contents[documentID]
          if(ZERO_MEASURES.includes(node.style.maxHeight)) {
            this.expandDocument(documentID)
          } else
            raf(() => this.collapseDocuments())
        }
        this.collapseDocuments = () => {
          const failed = []
          for(const node of Object.values(this.contents)) {
            if(node)
              node.style.maxHeight = 0
          }
          this.expanded = null
        }
        this.expandDocument = documentID => {
          this.collapseDocuments()
          this.expanded = documentID
          raf(() => this.updateHeight())
        }

        this.updateHeight = () => {
          const node = this.contents[this.expanded]
          if(node)
            node.style.maxHeight = `${node.scrollHeight}px`
        }
      }
    , componentDidMount() {
        const { expandedDocumentID } = this.props
        if(typeof expandedDocumentID !== 'undefined')
          this.expandDocument(expandedDocumentID)
      }
    , componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data)
          raf(() => this.updateHeight())
      }
    , render() {
        const { styles, theme, mapHeader, mapContent, data, ...gridProps } = this.props
        return (
          <Grid
            {...gridProps}
            data={data}
            mapDocument={
              ({ documentIndex, documentID, datum }) => {
                console.info('DATUM', datum.toJS())
                const header = mapHeader({ documentIndex, documentID, datum: datum.get('header') })
                const content = mapContent({ documentIndex, documentID, datum: datum.get('content') })
                return (
                  <div className={cn(styles.accordionDocument, theme.accordionDocument)}>
                    <div
                      onClick={() => this.toggleDocument(documentID)}
                      className={cn(styles.accordionHeader, theme.accordionHeader)}
                    >
                      {header}
                    </div>
                    <div
                      ref={x => this.contents[documentID] = x}
                      className={cn(styles.accordionContent, theme.accordionContent)}
                    >
                      {content}
                    </div>
                  </div>
                )
              }
            }
          />
        )
      }
    }
  )
}
