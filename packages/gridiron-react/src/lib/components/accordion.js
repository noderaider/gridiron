import cn from 'classnames'
import raf from 'raf'
import grid from './grid'
import column from './column/column'
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

  return pure.impure (
    { displayName: 'Accordion'
    , propTypes:  { styles: PropTypes.object.isRequired
                  , theme: PropTypes.object.isRequired
                  , mapHeader: PropTypes.func.isRequired
                  , mapContent: PropTypes.func.isRequired
                  , data: PropTypes.object.isRequired
                  , expandedDocumentID: PropTypes.any
                  , transitionDurationMS: PropTypes.number
                  , orientation: PropTypes.oneOf([ 'ttb', 'ltr' ])
                  }
    , defaultProps: { ...defaults
                    , orientation: 'ttb'
                    }
    , init() {
        this.contents = {}
        this.expanded = null
        this.toggleDocument = documentID => {
          const node = this.contents[documentID]
          const { orientation } = this.props
          if(ZERO_MEASURES.includes(node.style[orientation === 'ltr' ? 'maxWidth' : 'maxHeight'])) {
            this.expandDocument(documentID)
          } else
            raf(() => this.collapseDocuments())
        }
        this.collapseDocuments = () => {
          const { orientation } = this.props
          const failed = []
          for(const node of Object.values(this.contents)) {
            if(node)
              node.style[orientation === 'ltr' ? 'maxWidth' : 'maxHeight'] = 0
          }
          this.expanded = null
        }
        this.expandDocument = documentID => {
          this.collapseDocuments()
          this.expanded = documentID
          raf(() => this.updateDimension())
        }

        this.updateDimension = () => this.props.orientation === 'ltr' ? this.updateWidth() : this.updateHeight()

        this.updateHeight = () => {
          const node = this.contents[this.expanded]
          if(node)
            node.style.maxHeight = `${node.scrollHeight}px`
        }
        this.updateWidth = () => {
          const node = this.contents[this.expanded]
          if(node)
            node.style.maxWidth = `${node.scrollWidth}px`
        }
      }
    , componentDidMount() {
        const { expandedDocumentID } = this.props
        if(typeof expandedDocumentID !== 'undefined')
          this.expandDocument(expandedDocumentID)
      }
    , componentWillReceiveProps(nextProps) {
        if(nextProps.data !== this.props.data)
          raf(() => this.updateDimension())
      }
    , render() {
        const { styles, theme, className, mapHeader, mapContent, data, orientation, ...gridProps } = this.props
        return (
          <Grid
            {...gridProps}
            className={cn(styles.accordion, theme.accordion, styles[orientation], theme[orientation], className)}
            data={data}
            mapDocument={
              /*
              pure.impure(
                { displayName: 'AccordionDocument'
                , render */
                ({ documentIndex, documentID, datum }) => {
                    const header = mapHeader({ documentIndex, documentID, datum: datum.get('header') })
                    const content = mapContent({ documentIndex, documentID, datum: datum.get('content') })
                    return (
                      <div className={cn(styles.accordionDocument, theme.accordionDocument)}>
                        <button
                          onClick={() => this.toggleDocument(documentID)}
                          className={cn(styles.accordionHeader, theme.accordionHeader)}
                        >
                          <span>
                            {header}
                          </span>
                        </button>
                        <div
                          ref={x => this.contents[documentID] = x}
                          className={cn(styles.accordionContent, theme.accordionContent)}
                        >
                          {content}
                        </div>
                      </div>
                    )
                  }

                  /*
                }
              )
              */
            }
          />
        )
      }
    }
  )
}
