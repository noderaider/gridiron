import React, { PropTypes } from 'react'
import reactPre from 'react-pre'

const Pre = reactPre({ React })

const ErrorPage = ({ status, statusMessage, children, styles={} }) => {
  const title = `${status} ERROR | ${statusMessage}`
  return (
    <html className={styles.html}>
      <head>
        <title>{title}</title>
      </head>
      <body className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        {children ? <Pre className={styles.code}>{children}</Pre> : null}
      </body>
    </html>
  )
}

ErrorPage.propTypes = { status: PropTypes.number.isRequired
                      , statusMessage: PropTypes.string.isRequired
                      , children: PropTypes.any
                      , styles: PropTypes.object.isRequired
                      }
ErrorPage.defaultProps =  { status: 500
                          , statusMessage: 'You broke something!'
                          , styles: {}
                          }

export default ErrorPage
