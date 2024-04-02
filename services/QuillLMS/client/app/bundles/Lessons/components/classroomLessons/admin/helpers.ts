import * as IntF from '../interfaces';
import AdminExit from './exit';
import AdminFillInTheBlanks from './fillInTheBlanks';
import AdminFillInTheList from './fillInTheList';
import AdminLobby from './lobby';
import AdminModel from './model';
import AdminMultiStep from './multiStep';
import AdminSingleAnswer from './singleAnswer';
import AdminStatic from './static';
import AdminUnsupported from './unsupportedType';

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
    case 'CL-MS':
      return AdminMultiStep
    default:
      return AdminUnsupported
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
    case 'CL-MS':
      return 'Multistep'
    case 'CL-EX':
      return "Exit"
    default:
      return "NOT SUPPORTED"
  }
}

export function getClassroomLesson(props: IntF.ClassroomLessons, classroomLessonID: string): IntF.ClassroomLesson {
  return props[classroomLessonID]
}

export const slideTypeKeys = ['CL-ST', 'CL-MD', 'CL-SA', 'CL-FB', 'CL-FL', 'CL-MS']

export const scriptItemTypeKeys = ['STEP-HTML', 'STEP-HTML-TIP']
