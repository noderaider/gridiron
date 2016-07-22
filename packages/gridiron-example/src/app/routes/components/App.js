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

import './styles/vendor/font-awesome'
import './styles/fonts/fout.gcss'
import './styles/fonts/fonts.gcss'
import styles from './styles/App.css'

const IdleMonitor = createIdleMonitor({ React, connect })

class App extends Component {
  static propTypes = { dispatch: PropTypes.func.isRequired };
  static childContextTypes = contextTypes;
  getChildContext() {
    const { theme } = this.props
    return  { theme }
  }
  render(){
    const { dispatch, theme, title, subtitle, username, organization, email, full, packageName, errors, children } = this.props
    const { style } = theme

    return (
      <Maximize>
        {container => (
          <div style={{ marginBottom: 70 }}>
            <div className={styles.app}>
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
