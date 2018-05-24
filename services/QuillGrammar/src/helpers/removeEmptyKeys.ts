// borrowed from https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript

export const removeEmpty = (obj) => {
  Object.keys(obj).forEach((key) => (obj[key] == null || obj[key].length == 0) && delete obj[key]);
}
