import Promise from 'bluebird'

export const makeCancelable = promise => {
  let hasCanceled_ = false
  return {
    promise: new Promise(
      (resolve, reject) => promise
        .then(r => hasCanceled_
          ? reject({isCanceled: true})
          : resolve(r)
        )
    ),
    cancel() {
      hasCanceled_ = true
    }
  }
}
