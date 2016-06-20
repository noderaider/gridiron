import express from 'express'

export default function configureSecureRouter(paths) {
  let router = express.Router()
  router.use((req, res, next) => {
    if(paths.some(x => req.url.startsWith(x)))
      return res.redirect(`https://${req.get('Host')}${req.url}`)
    next()
  })
  return router
}
