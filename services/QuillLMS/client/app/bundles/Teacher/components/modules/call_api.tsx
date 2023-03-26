import { requestPut } from '../../../../modules/request/index';

function put(path: string, payload: object, onSuccess: Function, onError: Function): void {
  let uri = `${window.location.protocol}//${window.location.host}${path}`;
  requestPut(
    uri,
    payload,
    (body) => {
      if (onSuccess) onSuccess(body);
    },
    (body) => {
      if (onError) onError(body);
    }
  )
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
