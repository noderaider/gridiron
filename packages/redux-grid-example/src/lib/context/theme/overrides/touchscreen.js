export default theme => ( { style:  { ...theme.style
                                    , app: { backgroundColor: '#fff' }
                                    , body: { backgroundColor: '#fff', marginTop: '8px' }
                                    }
                          , sheet: () => require('./touchscreen.gcss')
                          } )
