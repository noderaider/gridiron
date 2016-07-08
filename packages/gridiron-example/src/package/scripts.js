 const GH_PAGES_ROOT = 'doc'

export default ({ path }) => {
  const copyToRoot = [ 'etc/config/config-server.json', 'etc/config/config-client.json', 'src/public' ]
  const copyToSrc = [ 'etc/config/config-server.json', 'etc/config/config-client.json' ]

  const scripts = { 'prebuild-package': 'rimraf package'
                  , 'build-package': 'babel src/package -d package'
                  , '_precopy-root-files': `rimraf ${copyToRoot.map(x => path.basename(x)).join(' ')}`
                  , 'copy-root-files': copyToRoot.map(x => `ncp ${x} ${path.basename(x)}`).join(' && ')
                  , '_precopy-src-files': `rimraf ${copyToSrc.map(x => `src/${path.basename(x)}`).join(' ')}`
                  , 'copy-src-files': copyToSrc.map(x => `ncp ${x} src/${path.basename(x)}`).join(' && ')

                  , 'prebuild-webpack': 'run-p copy-root-files copy-src-files'
                  , 'build-webpack': 'babel src/webpack.config.js -o webpack.config.js && babel src/webpack.static.config.js -o webpack.static.config.js && babel src/webpack.server.config.js -o webpack.server.config.js && babel src/webpack -d webpack'
                  , '_prebuild-config': 'rimraf config.js'
                  , 'build-config': 'babel src/config.js -o config.js && npm run build-webpack'

                  , 'webpack-static': 'webpack --config webpack.static.config.js --progress --profile --colors'
                  , 'webpack-app': 'webpack --config webpack.config.js --progress --profile --colors'
                  , 'webpack-server': 'webpack --config webpack.server.config.js --progress --profile --colors'
                  , 'webpack-server-watch': 'npm run webpack-server -- --watch'

                  , 'prebuild-app': 'rimraf public && npm run build-webpack'
                  , 'build-app': 'run-p webpack-static webpack-app'
                  , '_prebuild-bin': 'rimraf bin'
                  , 'build-bin': 'babel src/bin -d bin'
                  , 'watch-bin': 'npm run build-bin -- --watch'
                  , 'prebuild-lib': 'rimraf lib'
                  , 'build-lib': 'babel src/lib -d lib'
                  , 'watch-lib': 'npm run build-lib -- --watch'
                  , 'build-server': 'run-p build-lib webpack-server build-bin'
                  , 'watch-server': 'NODE_ENV=development run-p watch-lib webpack-server-watch watch-bin'
                  , 'link-dev': 'npm link ../redux-load ../react-load ../redux-addons ../redux-blueprint ../redux-idle-monitor ../react-redux-idle-monitor ../gridiron ../gridiron-view ../redux-middleware ../redux-mux ../save-as'
                  , 'build-lib-dev': 'NODE_ENV=development npm run build-lib'
                  , 'build-lib-prod': 'NODE_ENV=production npm run build-lib'
                  , 'build-prod': 'NODE_ENV=production run-s build-app build-lib-prod build-bin'
                  , 'build-dev': 'NODE_ENV=development run-s build-app build-lib-dev build-bin'
                  , 'watch-start': 'npm run build-bin && node bin/run | bunyan'
                  , 'prestart-hot': 'npm run build-config'
                  , 'start-hot': 'NODE_ENV=hot run-p build-app watch-server watch-bin'
                  , 'run-hot': 'NODE_ENV=hot node bin/run | bunyan'
                  , 'start': 'NODE_ENV=production npm run build-prod && node bin/run | bunyan'
                  , 'build': 'run-p build-app build-lib build-bin'
                  , 'watch': 'npm run watch-build'

                  , 'test': 'echo \"NO TESTS JUST YET\"'

                    /** RELEASE */
                  , 'prerelease': 'npm run test && npm run git-save -- path-release'
                  , 'release': 'npm version patch && npm publish'
                  , 'postrelease': 'npm run release-gh-pages'

                    /** GH-PAGES RELEASE */
                  , 'prerelease-gh-pages': 'npm run doc'
                  , 'release-gh-pages': 'run-s gh-pages-subtree gh-pages-push gh-pages-delete'
                  , 'postrelease-gh-pages': 'npm run clean && npm run git-save -- clean && git push -u origin master --follow-tags'

                    /** ESDOC */
                  , 'predoc': `rimraf ${GH_PAGES_ROOT}`
                  , 'doc': `esdoc -c ./esdoc.json && ncp CNAME ${GH_PAGES_ROOT}/CNAME`
                  , 'postdoc': 'npm run git-save -- doc'

                    /** GIT COMMANDS */
                  , 'gh-pages-subtree': `git subtree split --prefix ${GH_PAGES_ROOT} -b gh-pages`
                  , 'gh-pages-push': 'git push -f origin gh-pages:gh-pages'
                  , 'gh-pages-delete': 'git branch -D gh-pages'
                  , 'git-save': 'git add -A && git commit -am '

                    /** UPGRADE ALL DEPENDENCIES (REQUIRES npm-check-updates INSTALLED GLOBALLY) */
                  , 'upgrade': 'ncu -a && npm update'
                  }
  return scripts
}
