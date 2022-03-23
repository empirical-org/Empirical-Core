import { mainApiFetch } from "../../helpers/evidence/routingHelpers";

export const fetchLocker = async ({ queryKey, }) => {
  const [key, userId] = queryKey
  console.log("🚀 ~ file: lockerAPIs.ts ~ line 5 ~ fetchLocker ~ userId", userId)
  const response = await mainApiFetch(`lockers/${userId}`);
  console.log("🚀 ~ file: lockerAPIs.ts ~ line 6 ~ fetchLocker ~ response", response)
  const locker = await response.json();
  console.log("🚀 ~ file: lockerAPIs.ts ~ line 9 ~ fetchLocker ~ locker", locker)
  return locker;
}
