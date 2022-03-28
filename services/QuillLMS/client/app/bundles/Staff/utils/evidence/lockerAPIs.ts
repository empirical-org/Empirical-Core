import { mainApiFetch } from "../../helpers/evidence/routingHelpers";

export const fetchLocker = async ({ queryKey, }) => {
  const [key, userId] = queryKey
  const response = await mainApiFetch(`lockers/${userId}`);
  const locker = await response.json();
  return locker;
}
