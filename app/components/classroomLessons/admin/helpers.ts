import * as IntF from '../interfaces';
import AdminLobby from './lobby';
import AdminStatic from './static';
import AdminModel from './model';
import AdminSingleAnswer from './singleAnswer';
import AdminFillInTheBlanks from './fillInTheBlanks';
import AdminFillInTheList from './fillInTheList';
import AdminExit from './exit';

export function getComponent(type: string) {
  switch (type) {
    case 'CL-LB':
      return AdminLobby
    case 'CL-ST':
      return AdminStatic
    case 'CL-MD':
      return AdminModel
    case 'CL-SA':
      return AdminSingleAnswer
    case 'CL-FB':
      return AdminFillInTheBlanks
    case 'CL-FL':
      return AdminFillInTheList
    case 'CL-EX':
      return AdminExit
    default:
      return "NOT SUPPORTED"
  }
}

export function getComponentDisplayName(type: string): string {
  switch (type) {
    case 'CL-LB':
      return "Lobby"
    case 'CL-ST':
      return "Static"
    case 'CL-MD':
      return "Model"
    case 'CL-SA':
      return "Single Answer"
    case 'CL-FB':
      return "Fill In The Blanks"
    case 'CL-FL':
      return "Fill In The List"
    case 'CL-EX':
      return "Exit"
    default:
      return "NOT SUPPORTED"
  }
}

export function getClassroomLesson(props: IntF.ClassroomLessons, classroomLessonID: string): IntF.ClassroomLesson {
  return props[classroomLessonID]
}

export function getClassroomLessonSlide(props: IntF.ClassroomLessons, classroomLessonID: string, slideID: string): IntF.Question {
  return getClassroomLesson(props, classroomLessonID).questions[slideID]
}

export function getClassroomLessonScriptItem(props: IntF.ClassroomLessons, classroomLessonID: string, slideID: string, scriptItemID: string): IntF.ScriptItem {
  return getClassroomLessonSlide(props, classroomLessonID, slideID).data.teach.script[scriptItemID]
}
