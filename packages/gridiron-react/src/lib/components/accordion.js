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
                  , autoToggle: PropTypes.bool.isRequired
                  }
    , defaultProps: { ...defaults
                    , orientation: 'ttb'
                    , autoToggle: true
                    }
    , state: { expandedID: null }
    , init() {
        this.contents = {}
        this.toggleDocument = documentID => {
          const node = this.contents[documentID]
          const { orientation } = this.props
          if(ZERO_MEASURES.includes(node.style[orientation === 'ltr' ? 'maxWidth' : 'maxHeight'])) {
            this.expandDocument(documentID)
          } else
            raf(this.collapseDocuments)
        }
        this.collapseDocuments = () => {
          const { orientation } = this.props
          const failed = []
          for(const node of Object.values(this.contents)) {
            if(node)
              node.style[orientation === 'ltr' ? 'maxWidth' : 'maxHeight'] = 0
          }
          this.setState({ expandedID: null })
        }
        this.expandDocument = documentID => {
          this.collapseDocuments()
          this.setState({ expandedID: documentID })
          raf(this.updateDimension)
        }

        this.updateDimension = () => this.props.orientation === 'ltr' ? this.updateWidth() : this.updateHeight()

        this.updateHeight = () => {
          const node = this.contents[this.state.expandedID]
          if(node)
            node.style.maxHeight = `${node.scrollHeight}px`
        }
        this.updateWidth = () => {
          const node = this.contents[this.state.expandedID]
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
          raf(this.updateDimension)
      }
    , render() {
        const { styles, theme, className, mapHeader, mapContent, data, orientation, autoToggle, ...gridProps } = this.props

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
                    const fns = (
                      { toggleDocument: () => this.toggleDocument(documentID)
                      , collapseDocuments: () => this.collapseDocuments()
                      , expandDocument: () => this.expandDocument(documentID)
                      }
                    )
                    const header = mapHeader({ documentIndex, documentID, datum: datum.get('header'), fns })

                    return (
                      <div className={cn(styles.accordionDocument, theme.accordionDocument)}>
                        <button
                          onClick={autoToggle ? fns.toggleDocument : null}
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
                          {this.state.expandedID === documentID && mapContent({ documentIndex, documentID, datum: datum.get('content'), fns })}
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
