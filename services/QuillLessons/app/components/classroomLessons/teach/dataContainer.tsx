import React from 'react';
import gql from 'graphql-tag';
// import  GetLessonQuery  from '../queries/getLessonQuery';
import { ChildDataProps, graphql } from "react-apollo";
import { ClassroomLesson } from '../../../interfaces/classroomLessons';
import { Question, ClassroomLessonSession } from '../interfaces';
import { getParameterByName } from '../../../libs/getParameterByName';
import * as R from 'ramda';
import Sidebar from './sidebar';
import MainContentContainer from './mainContentContainer';

const QUERY = gql`
  subscription GetLessonSession($id: String!) {
    classroomLessonSession(id: $id) {
      absentTeacherState
      classroom_name
      current_slide
      flaggedStudents
      followUpActivityName
      followUpOption
      followUpUrl
      models
      prompts
      selected_submissions
      selected_submission_order
      startTime
      student_ids
      students
      submissions
      supportingInfo
      teacher_ids
      teacher_name
      timestamps
      presence
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

export type Edition = {
  name: string
  questions: [Question]
}

export type Lesson = {
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

const withLesson = graphql<InputProps, Response, Variables, ChildDataProps>(QUERY, {
  options: ({params}) => ({
    variables: {
      id: getParameterByName('classroom_unit_id') + params.lessonID
    }
  }),
})

export default withLesson(({ data: {loading, classroomLessonSession, error}, params}) => {
  if (loading) return <div>Loading</div>;
  if (error) return <h1>DATA ERROR ${error}</h1>;

  if (classroomLessonSession) {
    const data = splitPayload(classroomLessonSession);
    if (data.isError) {
      return (<h1>{data.error}</h1>)
    } else if ( data.isError === false ){
      const {session, edition, lesson} = data.value;
      const teachLessonContainerStyle = session.preview
    ? {'height': 'calc(100vh - 113px)'}
    : {'height': 'calc(100vh - 60px)'}
      return (
        <div className="teach-lesson-container" style={teachLessonContainerStyle}>
          {/* <p>Current Slide {session.current_slide}</p>
          <p>Edition Name: {edition.name}</p>
          <p>Lesson Title: {lesson.title}</p> */}
          <Sidebar params={params} session={session} edition={edition} lesson={lesson}></Sidebar>
          <MainContentContainer params={params} session={session} edition={edition} lesson={lesson}/>
        </div>
      )
    }
    return (<div>Loading</div>)
  }
  return (<div>Loading</div>)
})