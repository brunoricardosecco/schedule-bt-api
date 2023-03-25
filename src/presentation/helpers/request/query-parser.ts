export const queryParser = (queryParams: Object): Object => {
  const parsedObj = {}

  Object.keys(queryParams).forEach(key => Object.assign(parsedObj, { [key]: parseNumber(queryParams[key]) }))

  return parsedObj
}

const parseNumber = (str: string): number | string => {
  const num = parseInt(str, 10)
  if (!isNaN(num) && String(num) === str) {
    return num
  }
  return str
}
