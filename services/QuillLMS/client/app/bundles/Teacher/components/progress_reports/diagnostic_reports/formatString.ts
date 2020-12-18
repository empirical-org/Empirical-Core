const formatString = (str: string) => {
  return str.replace(/&#x27;/g, "'").replace(/&nbsp;/g, '').replace(/(<([^>]+)>)/ig, '').replace(/&quot;/g, '"')
}

export default formatString
