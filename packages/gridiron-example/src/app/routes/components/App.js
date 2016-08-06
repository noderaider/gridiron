import pure from 'lib/modules/pure'

import { client, log, IS_BROWSER } from 'config'
import TopBar from 'app/elements/nav/TopBar'
import FooterBar from 'app/elements/nav/FooterBar'
import DevTools from 'lib/redux/DevTools'

import childContextTypes, { schemeNames, getTheme } from 'lib/context'

import './styles/vendor/font-awesome'
import './styles/fonts/fout.gcss'
import './styles/fonts/fonts.gcss'
import styles from './styles/App.css'

const { React, PropTypes, cloneElement, gridiron, IdleMonitor } = pure
const { Logo, Maximize } = gridiron

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

export default pure (
  { displayName: 'App'
  , connect
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
