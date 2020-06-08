import { TurkSessionInterface } from '../../interfaces/comprehensionInterfaces';

export const fetchTurkSessions = async () => {
  let turkSessions: TurkSessionInterface[];
  let error: any = null;
  try {
    const response = await fetch('https://comprehension-247816.appspot.com/api/turking.json');
    turkSessions = await response.json();
  } catch (err) {
    error = err;
  }
  return {
    error,
    turkSessions
  }
}
