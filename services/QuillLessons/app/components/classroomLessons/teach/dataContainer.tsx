import React from 'react';
import gql from 'graphql-tag';
// import  GetLessonQuery  from '../queries/getLessonQuery';
import { ChildDataProps, graphql } from "react-apollo";
import { ClassroomLesson } from '../../../interfaces/classroomLessons';
import { Question } from '../interfaces';
import { getParameterByName } from '../../../libs/getParameterByName';
import * as R from 'ramda';

const QUERY = gql`
  subscription GetLessonSession($id: String!) {
    classroomLessonSession(id: $id) {
      absentTeacherState
      classroom_name
      current_slide
      followUpActivityName
      followUpOption
      followUpUrl
      models
      prompts
      startTime
      student_ids
      students
      supportingInfo
      teacher_ids
      teacher_name
      timestamps
      edition {
        name
        questions {
          type
          data {
            teach {
              title
              script {
                type
                data
              }
            }
            play {
              html
              instructions
              cues
              prompt
              stepLabels
            }
          }
        }
        lesson {
          lesson
          title
          topic
          unit
        }
      }
      
    }
  }
`

type ClassroomLessonSession = {
  absentTeacherState: boolean
  classroom_name: string
  current_slide: string
  edition_id: string
  followUpActivityName: string
  followUpOption: string
  followUpUrl: string
  id: string
  models: any
  prompts: any
  startTime: string
  student_ids: any
  students: any
  supportingInfo: string
  teacher_ids: any
  teacher_name: string
  timestamps: any
}

type Edition = {
  name: string
  questions: [Question]
}

type Lesson = {
  lesson: string
  title: string
  topic: string
  unit: string
}

type EditionResponse = Edition & {
  lesson: Lesson
}

type SubscribedSession = ClassroomLessonSession & {
  edition: EditionResponse 
} 

type Response = {
  classroomLessonSession: SubscribedSession
};

type Variables = {
  id: string 
}

type InputProps = {
  params: any
}

type LessonProps = {
  session: ClassroomLessonSession
  edition: Edition
  lesson: Lesson
};

type SplitPayloadResult = {
  isError: true
  error: Error
} | {
  isError: false
  value: LessonProps
};

function splitPayload(payloadSession: SubscribedSession):SplitPayloadResult {
  const lesson:Lesson|undefined = R.path(['edition', 'lesson'], payloadSession);
  const edition:Edition|undefined = R.path(['edition'], R.dissocPath(['edition', 'lesson'], payloadSession))
  const session:ClassroomLessonSession = R.dissocPath(['edition'], payloadSession)
  if (lesson && edition) {
    return {
      isError: false,
      value:  {
        session,
        edition,
        lesson
      }
    }
  } else {
    return {
      isError: true,
      error: new Error("Session is missing lesson or edition")
    }
  }
}

type ChildProps = ChildDataProps<InputProps, Response, Variables>;

const withLesson = graphql<InputProps, Response, Variables, ChildProps>(QUERY, {
  options: ({params}) => ({
    variables: {
      id: getParameterByName('classroom_unit_id') + params.lessonID
    }
  })
})

export default withLesson(({ data: {loading, classroomLessonSession, error}}) => {
  if (loading) return <div>Loading</div>;
  if (error) return <h1>DATA ERROR</h1>;

  if (classroomLessonSession) {
    const data = splitPayload(classroomLessonSession);
    if (data.isError) {
      return (<h1>{data.error}</h1>)
    } else if ( data.isError === false ){
      const {session, edition, lesson} = data.value;
      return (
        <div>
          <p>Current Slide {session.current_slide}</p>
          <p>Edition Name: {edition.name}</p>
          <p>Lesson Title: {lesson.title}</p>
        </div>
      )
    }
    
  }
  return (<div>Loading</div>)
})