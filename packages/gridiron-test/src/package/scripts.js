/**
 * This script gets compiled by repackage and replaces the scripts node in the
 * package.json. Use linux style setting of environment variables, if on
 * Windows, the scripts will have the commands swapped for Windows versions.
 */

 const GH_PAGES_ROOT = 'doc'

                          /** START SCRIPT STARTS BUILD WITH WATCHING ENABLED (USEFUL WITH NPM LINK) */
export default ({}) => ({ 'start': 'npm run test-watch'

                          /** CLEAN EVERYTHING PRE BUILD */
                        , 'clean': 'rimraf doc'

                          /** TEST */
                        , 'test-mocha': 'mocha --require test/mock/dom --harmony --es_staging --compilers .:test/compiler test/*.js'
                        , 'test': 'nyc npm run test-mocha'
                        , 'coverage': 'nyc report --reporter=text-lcov > coverage.lcov && codecov'
                        , 'test-watch': 'npm run test-mocha -- --watch'
                        , 'test-debug': 'node-debug --nodejs --harmony --no-preload --save-live-edit --hidden node_modules/ _mocha --watch --debug'

                          /** RELEASE */
                        , 'prerelease': 'npm run test'
                        , 'release': 'npm version patch && npm publish'
                        , '_postrelease': 'npm run release-gh-pages'

                          /** GH-PAGES RELEASE */
                        , 'prerelease-gh-pages': 'npm run doc'
                        , 'release-gh-pages': 'run-s gh-pages-subtree gh-pages-push gh-pages-delete'
                        , 'postrelease-gh-pages': 'npm run clean-doc && npm run git-save -- clean && git push -u origin master --follow-tags'

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
                        })
