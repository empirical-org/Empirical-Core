import { handleApiError, mainApiFetch } from "../../helpers/evidence/routingHelpers";

export const fetchLocker = async ({ queryKey, }) => {
  const [key, userId] = queryKey
  const response = await mainApiFetch(`lockers/${userId}`);
  const locker = await response.json();
  return locker;
}

export const createLocker = async (userId: string, locker: any) => {
  const { label, preferences } = locker;
  const response = await mainApiFetch(`lockers`, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      label: label,
      preferences: preferences
    })
  });
  return { error: handleApiError('Failed to update locker, please try again', response) }
}

export const updateLocker = async (userId: string, locker: any) => {
  const { label, preferences } = locker;
  const response = await mainApiFetch(`lockers/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      user_id: userId,
      label: label,
      preferences: preferences
    })
  });
  return { error: handleApiError('Failed to update locker, please try again', response) }
}
