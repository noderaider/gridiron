import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import IdleMonitor from 'react-redux-idle-monitor'

import { client, log, IS_BROWSER } from 'config'
import TopBar from 'app/elements/nav/TopBar'
import FooterBar from 'app/elements/nav/FooterBar'

import { contextTypes, getTheme, defaultTheme } from 'lib/context'


const gridProps = { xs: 12, xsOffset: 0
                  , sm: 10, smOffset: 1
                  , md: 8, mdOffset: 2
                  , lg: 4, lgOffset: 4
                  }

const browserInit = ({ theme }) => {
  const { style } = theme
  const { backgroundColor, margin, padding } = style.body
  document.body.style.backgroundColor = backgroundColor
  document.body.style.margin = margin
  document.body.style.padding = padding
  if(!window.google_tag_manager)
    console.info('GTM BLOCKED => consider disabling ad block so we can see how much usage we\'re getting')
}

class App extends Component {
  static propTypes = { dispatch: PropTypes.func.isRequired };
  static childContextTypes = contextTypes;
  componentDidMount() {
    require('app/fonts/fout')
    require('app/fonts/Lato-Regular.ttf')
    require('app/fonts/Lato-Bold.ttf')
    //if(IS_BROWSER) browserInit(this.props)
  }
  getChildContext() {
    const { theme } = this.props
    return  { gridProps, theme }
  }
  render(){
    const { dispatch, theme, title, subtitle, username, organization, email, full, packageName, errors, children } = this.props
    const { style } = theme

    return (
      <div>
        <div style={style.app}>
          <TopBar title={title} subtitle={subtitle} username={username} email={email} packageName={packageName} />
          {children}
          <FooterBar />
        </div>
        <IdleMonitor showStatus={true} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const { visual, errors } = state
  return  { theme: visual.theme ? getTheme(visual.theme) : defaultTheme
          , title: visual.text.get('title')
          , subtitle: visual.text.get('subtitle')
          , username: visual.text.get('username')
          , organization: visual.text.get('organization')
          , email: visual.text.get('email')
          , full: visual.text.get('full')
          , packageName: visual.text.get('packageName')
          , errors
          }
}

export default connect(mapStateToProps)(App)
