import _ from 'underscore';

export function getStatusForResponse(response = {}) {
  if (!response.feedback) {
    return 4;
  } else if (response.parentID) {
    return (response.optimal ? 2 : 3);
  }
  return (response.optimal ? 0 : 1);
}

export default function responsesWithStatus(responses = {}) {
  return _.mapObject(responses, (value, key) => {
    const statusCode = getStatusForResponse(value);
    return Object.assign({}, value, { statusCode, });
  });
}
