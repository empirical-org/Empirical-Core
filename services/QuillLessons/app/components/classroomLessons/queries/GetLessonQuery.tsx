import {
  ClassroomLesson
} from '../../../interfaces/classroomLessons'
import { Query } from 'react-apollo';

interface Data {
  classroomLesson: ClassroomLesson
}

interface Variables {
  id: string
}

export default class GetLessonQuery extends Query<Data, Variables> {}