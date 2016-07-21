import React, { Component, PropTypes, cloneElement } from 'react'

import { connect } from 'react-redux'
import createIdleMonitor from 'react-redux-idle-monitor'

import { client, log, IS_BROWSER } from 'config'
import TopBar from 'app/elements/nav/TopBar'
import FooterBar from 'app/elements/nav/FooterBar'
import DevTools from 'lib/redux/DevTools'

import contextTypes, { schemeNames, getTheme } from 'lib/context'

import { Maximize } from 'lib/components/modules/react-maximize'
import { Logo } from 'lib/components/modules/gridiron-react'
import { FormsContext } from 'lib/components/modules/react-formula'

const IdleMonitor = createIdleMonitor({ React, connect })

const gridProps = { xs: 12
                  , sm: 10
                  , md: 8
                  , lg: 4
                  , xsOffset: 0
                  , smOffset: 1
                  , mdOffset: 2
                  , lgOffset: 4
                  }

const browserInit = ({ theme }) => {
  const { style } = theme
  const { backgroundColor, margin, padding } = style.body
  document.body.style.backgroundColor = 'rgb(150, 150, 150)' //backgroundColor
  document.body.style.margin = margin
  document.body.style.padding = padding
  /*
  if(!window.google_tag_manager)
    console.info('GTM BLOCKED => consider disabling ad block so we can see how much usage we\'re getting')
  */
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
      <Maximize>
        {container => (
          <div style={{ marginBottom: 70 }}>
            <div style={style.app}>
              <TopBar logo={<Logo />} username={username} email={email} packageName={packageName} />
              {cloneElement(children, { container })}
              <FooterBar />
            </div>
            <DevTools />
            <IdleMonitor showStatus={true} />
          </div>
        )}
      </Maximize>
    )
  }
}

function mapStateToProps(state) {
  const { visual, errors } = state
  return  { theme: getTheme('solarized-dark') //visual.theme ? getTheme(visual.theme) : defaultTheme
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
