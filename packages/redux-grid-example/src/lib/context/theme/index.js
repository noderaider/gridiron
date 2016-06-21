import classNames from 'classnames'
import { defaultTheme } from '../../../config'
import  { flat
        , grayscale
        , railscasts
        , solarized
        , monokai
        } from 'base16'

import getOverride from './overrides'


const normalizeScheme = scheme => {
  return  { scheme: scheme.scheme
          , base03: scheme.base00
          , base02: scheme.base01
          , base01: scheme.base02
          , base00: scheme.base03
          , base0: scheme.base04
          , base1: scheme.base05
          , base2: scheme.base06
          , base3: scheme.base07
          , red: scheme.base08
          , orange: scheme.base09
          , yellow: scheme.base0A
          , green: scheme.base0B
          , cyan: scheme.base0C
          , blue: scheme.base0D
          , magenta: scheme.base0E
          , violet: scheme.base0F
          }
}

function getOthers() {
  return  { flat
          , grayscale
          , railscasts
          , solarized
          , monokai
          }
}

function getScheme(name) {
  return normalizeScheme(getOthers()[name])
}


const appClass = classNames('body-content', 'container')

const invertPalette = palette => {
  return  { ...palette
          , base03: palette.base3
          , base02: palette.base2
          , base01: palette.base1
          , base00: palette.base0
          , base0:  palette.base00
          , base1:  palette.base01
          , base2:  palette.base02
          , base3:  palette.base03
          }
}

const buildTheme = (name, palette, inverted=false) => {
  const p = inverted ? invertPalette(palette) : palette

  const color = { primary: p['base3']
                , secondary: p['base00']
                , tertiary: p['base1']
                , accent: p['yellow']
                , emphasized: p['base01']
                }

  const brand = { default: p['base2']
                , primary: p['yellow']
                , info: p['cyan']
                , success: p['green']
                , warning: p['orange']
                , danger: p['red']
                }

  return  { name
          , palette: p
          , color
          , brand
                      /** body styles are set directly on the html (should not be react shorthands) */
          , style:  { body: { width: '100%'
                            , backgroundColor: p['base3']
                            , float: 'left'
                            , paddingBottom: '50px'
                            }
                    , app:  { width: '100%'
                            , height: '100%'
                            , backgroundColor: color.primary
                            , color: color.secondary
                            }
                    , footer: { }
                    , panel:  { backgroundColor: brand.default
                              , borderColor: color.tertiary
                              , borderStyle: 'solid'
                              , borderWidth: 1
                              , margin: 20
                              , paddingLeft: 10
                              , paddingRight: 10
                              , borderRadius: 8
                              , fontFamily: 'Lato'
                              , fontWeight: 400
                              }
                    , bold: { fontWeight: 700 }
                    , link: { color: p['blue']
                            , cursor: 'pointer'
                            }
                    , label:  { color: color.secondary
                              , backgroundColor: brand.default
                              , borderColor: color.secondary
                              , borderWidth: 1
                              , borderStyle: 'solid'
                              , borderRadius: 2
                              , margin: 2
                              , padding: 2
                              , paddingLeft: 4
                              , paddingRight: 4
                              , fontSize: 10
                              , fontWeight: 700
                              , fontFamily: ['Helvetica Neue','Helvetica','Arial','sans-serif']
                              , whiteSpace: 'nowrap'
                              , display: 'inline'
                              , cursor: 'default'
                              }
                    , input:  { color: p['base03']
                              , backgroundColor: p['base3']
                              , borderColor: color.tertiary
                              , borderWidth: 1
                              , borderStyle: 'solid'
                              }
                    }
          }
}


export const schemeNames =  [ 'flat'
                            , 'grayscale'
                            , 'railscasts'
                            , 'solarized'
                            , 'monokai'
                            ]

export const getTheme = (themeName = defaultTheme) => {
  if(!themeName.includes('-'))
    throw new Error(`Incorrect format provided => '${themeName}', must be of format 'scheme-(light|dark)'`)

  const [schemeName, lightOrDark] = themeName.split('-')
  const inverted = lightOrDark === 'dark'

  const palette = getScheme(schemeName)
  if(!palette)
    throw new Error(`No theme exists for scheme '${schemeName}', options are [${schemeNames.join(',')}]`)
  return buildTheme(`${schemeName}-${inverted ? 'dark' : 'light'}`, palette, inverted)
}



export const getThemeForUrl = (themeName = defaultTheme, url) => {
  let theme = getTheme(themeName)
  let override = getOverride({ url })
  if(override)
    return { ...theme, ...override(theme), isFallback: true }
  return theme
}
