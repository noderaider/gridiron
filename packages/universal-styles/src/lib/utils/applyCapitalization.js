export default function applyCapitalization (str, minLength = 2) {
  return str.length < minLength ? str.toUpperCase() : `${str[0].toUpperCase()}${str.slice(1)}`
}
