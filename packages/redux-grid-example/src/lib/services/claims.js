export const getClaim = (decodedToken, name) => decodedToken[name]
export const hasClaim = (decodedToken, name, value) => {
  let claim = getClaim(decodedToken, name)
  // if claim exists but value was not specified, return true
  if (claim && !value)
    return true
  if (claim)
    return Array.isArray(claim) ? claim.indexOf(value) !== -1 : claim === value
}
