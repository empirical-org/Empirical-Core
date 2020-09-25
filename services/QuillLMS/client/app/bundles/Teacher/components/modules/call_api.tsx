import request from 'request';

import getAuthToken from './get_auth_token';

function put(path: string, payload: object, onSuccess: Function, onError: Function): void {
  let uri = `${window.location.protocol}//${window.location.host}${path}`;
  let authedPayload = Object.assign(payload, {authenticity_token: getAuthToken()});
  request({
    method: 'PUT',
    uri: uri,
    json: authedPayload,
  }, (error, response) => {
    if (error) {
      // TODO: Replace this with some sort of real error reporting
      throw error;
    }
    switch (response.statusCode) {
      case 200:
        if (onSuccess) onSuccess(response);
        break;
      case 422:
        if (onError) onError(response);
        break;
    }
  });
}

export function changeActivityPackName(activityPackId: Number, name: string, onSuccess: Function, onError: Function): void {
  let uri = `/teachers/units/${activityPackId}`;
  let payload = {unit: {name: name}};
  put(uri, payload, onSuccess, onError);
}

export function changeActivityPackOrder(activityPackId: Number, activityIds: Array<Number>, onSuccess: Function, onError: Function): void {
  let uri = `/teachers/units/${activityPackId}/update_activities`;
  let payload = {data: {activities_data: activityIds.map((id) => { return {id: id} })}};
  put(uri, payload, onSuccess, onError);
}
