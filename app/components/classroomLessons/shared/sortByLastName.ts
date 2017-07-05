import {
  Students
} from '../interfaces';

export function sortByLastName(key1: string, key2: string, students: Students) {
  const last1: string = students[key1].split(" ").slice(-1)[0];
  const last2: string = students[key2].split(" ").slice(-1)[0];
  if (last1 < last2) {
    return -1;
  } else if (last1 > last2) {
    return 1;
  } else {
    return 0
  }
}
