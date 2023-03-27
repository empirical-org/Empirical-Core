import {
    Students
} from '../interfaces';

export function sortByLastName(name1: string, name2: string, students: Students) {
  const student1: string|null = students[name1]
  const student2: string|null = students[name2]
  if (student1 && student2) {
    const lastName1: string = students[name1].split(" ").slice(-1)[0];
    const lastName2: string = students[name2].split(" ").slice(-1)[0];
    return sort(lastName1, lastName2)
  } else {
    return 0
  }
}

export function sortByDisplayed(selected1: boolean, selected2: boolean) {
  return sort(selected1, selected2)
}

export function sortByTime(time1: number, time2: number) {
  return sort(time1, time2)
}

export function sortByFlag(flagged1: boolean, flagged2: boolean) {
  return sort(flagged1, flagged2)
}

export function sortByAnswer(answer1: string, answer2: string) {
  return sort(answer1, answer2)
}

function sort(param1: any, param2: any) {
  if (param1 < param2) {
    return -1;
  } else if (param1 > param2) {
    return 1;
  } else {
    return 0
  }
}
