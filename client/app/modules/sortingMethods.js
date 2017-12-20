import _ from 'underscore'

export function sortInnerLinkTextByLastNameForReactTableCell(fullCell1,fullCell2){
  const fullName1 = fullCell1.props.children.props.children
  const fullName2 = fullCell2.props.children.props.children
  return sortByLastName(fullName1, fullName2);
}

export function sortByLastName(fullName1, fullName2){
  const lastName1 = _.last(fullName1.split(' '))
  const lastName2 = _.last(fullName2.split(' '))
  return sort(lastName1, lastName2);
}

export function sort(param1, param2) {
  if (param1 < param2) {
    return -1;
  } else if (param1 > param2) {
    return 1;
  } else {
    return 0
  }
}
