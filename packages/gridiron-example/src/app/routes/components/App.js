import pure from 'lib/modules/pure'

import createIdleMonitor from 'react-redux-idle-monitor'

import { client, log, IS_BROWSER } from 'config'
import TopBar from 'app/elements/nav/TopBar'
import FooterBar from 'app/elements/nav/FooterBar'
import DevTools from 'lib/redux/DevTools'

import childContextTypes, { schemeNames, getTheme } from 'lib/context'

import { Maximize } from 'lib/modules/react-maximize'
import { Logo } from 'lib/modules/gridiron-react'

import './styles/vendor/font-awesome'
import './styles/fonts/fout.gcss'
import './styles/fonts/fonts.gcss'
import styles from './styles/App.css'

const IdleMonitor = createIdleMonitor({ React, connect })


const connect = (
  { mapStateToProps: ({ visual, errors }) => (
      { theme: getTheme('solarized-dark')
      , title: visual.text.get('title')
      , subtitle: visual.text.get('subtitle')
      , username: visual.text.get('username')
      , organization: visual.text.get('organization')
      , email: visual.text.get('email')
      , full: visual.text.get('full')
      , packageName: visual.text.get('packageName')
      , errors
      }
    )
  }
)


const { React, PropTypes } = pure

export default pure (
  { connect
  , childContextTypes
  , getChildContext() {
      return { theme: this.props.theme }
    }
  , render(){
      const { title, subtitle, username, organization, email, full, packageName, errors, children } = this.props

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
)
