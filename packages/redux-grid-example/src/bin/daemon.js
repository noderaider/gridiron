#! /usr/bin/env node

import name from '../lib/package/name'
import pm2 from 'pm2'

const script = 'bin/run.js'
const max_memory_restart = '100M'
//const exec_mode = 'cluster'

pm2.connect(err => {
  if(err) {
    console.error(err)
    process.exit(2)
  }


  const opts =  { name
                , script
                , max_memory_restart
                }
  pm2.start(opts, (err, apps) => {
    if(err)
      console.error(err)
    pm2.disconnect()
  })
})
