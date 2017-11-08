import * as IntF from '../classroomLessons/interfaces';
import * as CLIntF from '../../interfaces/ClassroomLessons';
import CustomizeStatic from './slides/static';
import CustomizeModel from './slides/model';
import CustomizeSingleAnswer from './slides/singleAnswer';
import CustomizeFillInTheBlanks from './slides/fillInTheBlanks';
import CustomizeFillInTheList from './slides/fillInTheList';
import CustomizeExit from './slides/exit';
import CustomizeUnsupported from './slides/unsupportedType';
import CustomizeMultistep from './slides/multistep';

export function getComponent(type: string) {
  switch (type) {
    case 'CL-ST':
      return CustomizeStatic
    case 'CL-MD':
      return CustomizeModel
    case 'CL-SA':
      return CustomizeSingleAnswer
    case 'CL-FB':
      return CustomizeFillInTheBlanks
    case 'CL-FL':
      return CustomizeFillInTheList
    case 'CL-EX':
      return CustomizeExit
    case 'CL-MS':
      return CustomizeMultistep
    default:
      return CustomizeUnsupported
  }
}
