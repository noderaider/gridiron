/**
 * repackage - https://github.com/noderaider/repackage
 * This script gets compiled by repackage and replaces the scripts node in the
 * package.json. Use linux style setting of environment variables, if on
 * Windows, the scripts will have the commands swapped for Windows versions.
 */

 const GH_PAGES_ROOT = 'doc'

                          /** START SCRIPT STARTS BUILD WITH WATCHING ENABLED (USEFUL WITH NPM LINK) */
export default ({}) => ({ 'start': 'run-p -lnc build-watch test-watch'

                          /** CLEAN EVERYTHING PRE BUILD */
                        , 'clean': 'run-p clean-lib clean-doc clean-test'
                        , 'clean-lib': 'rimraf lib'
                        , 'clean-doc': 'rimraf doc'
                        , 'clean-test': 'rimraf coverage.lcov'

                          /** BUILD */
                        , 'prebuild': 'npm run clean'
                        , 'build': 'babel src/lib -d lib'
                        , 'build-watch': 'npm run build -- --watch'

                          /** TEST */
                        , 'pretest-mocha': 'npm run build'
                        , 'test-mocha': 'mocha --harmony --es_staging --require test/require'
                        , 'test-mocha-md': 'mocha --harmony --es_staging --require test/require --reporter markdown | tee TEST.md'
                        , 'test': 'nyc npm run test-mocha'
                        , 'coverage': 'nyc report --reporter=text-lcov > coverage.lcov && codecov'
                        , 'test-watch': 'npm run test-mocha -- --watch'

                        /** MARKDOWN */
                        , 'md-create-readme': 'cat md/README.md > README.md'
                        , 'md-insert-spacer': 'cat md/SPACER.md >> README.md'
                        , 'md-insert-rule': 'cat md/RULE.md >> README.md'
                        , 'md-insert-code': 'cat md/CODE.md >> README.md'
                        , 'md-insert-test-header': 'cat md/HEADER_TEST.md >> README.md'
                        , 'md-insert-test-content': 'cat TEST.md >> README.md'
                        , 'md-insert-test': 'run-s md-insert-test-header md-insert-test-content'
                        , 'md-insert-coverage-header': 'cat md/HEADER_COVERAGE.md >> README.md'
                        , 'md-insert-coverage-content': 'cat COVERAGE.md >> README.md'
                        , 'md-insert-coverage': 'run-s md-insert-coverage-header md-insert-code md-insert-coverage-content md-insert-code'
                        , 'md-combine': 'run-s -ln test-mocha-md md-create-readme md-insert-rule md-insert-test'

                          /** RELEASE */
                        , 'preversion': 'run-s -ln build test'
                        , 'version': 'run-s -ln md-combine'
                        , 'release': 'npm version patch'
                        , 'release:minor': 'npm version minor'
                        , 'release:major': 'npm version major'
                        , 'postversion': 'npm publish'
                        , '_postpublish': 'run-s -ln git-push release-gh-pages'

                          /** GH-PAGES RELEASE */
                        , 'prerelease-gh-pages': 'npm run doc'
                        , 'release-gh-pages': 'run-s gh-pages-subtree gh-pages-push gh-pages-delete'
                        , 'postrelease-gh-pages': 'run-s -lnc clean-doc git-commit:doc && git push -u origin master --follow-tags'

                          /** ESDOC */
                        , 'predoc': `rimraf ${GH_PAGES_ROOT}`
                        , 'doc': `esdoc -c ./esdoc.json && ncp CNAME ${GH_PAGES_ROOT}/CNAME`

                          /** GIT COMMANDS */
                        , 'gh-pages-subtree': `git subtree split --prefix ${GH_PAGES_ROOT} -b gh-pages`
                        , 'gh-pages-push': 'git push -f origin gh-pages:gh-pages'
                        , 'gh-pages-delete': 'git branch -D gh-pages'
                        , 'git-add': 'git add -A'
                        , 'git-commit:doc': 'git commit -am doc'
                        , 'git-push': 'git push --follow-tags'
                        })
