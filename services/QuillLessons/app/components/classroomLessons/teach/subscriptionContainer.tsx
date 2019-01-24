import React from 'react';
import gql from 'graphql-tag';
// import  GetLessonQuery  from '../queries/getLessonQuery';
import { ChildDataProps, graphql, Subscription } from "react-apollo";
import { ClassroomLesson } from '../../../interfaces/classroomLessons';
import { ClassroomLessonSession } from '../interfaces';
import { getParameterByName } from '../../../libs/getParameterByName';
import dataContainer from './dataContainer';

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
        flags
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

// type subscribedEdition = 

// type SubscribedSession = ClassroomLessonSession & {edition: } 

type Response = {
  classroomLessonSession:  any
}

type Variables = {
  id: string 
}

type InputProps = {
  params: any
}

type ChildProps = ChildDataProps<InputProps, Response, Variables>;

// const withLesson = graphql<InputProps, Response, Variables, ChildProps>(QUERY, {
//   options: ({params}) => ({
//     variables: {
//       id: getParameterByName('classroom_unit_id') + params.lessonID
//     }
//   })
// })

// export default withLesson(({ data: {loading, classroomLessonSession, error}}) => {
  // if (loading) return <div>Loading</div>;
  // if (error) return <h1>ERROR</h1>;

  // if (classroomLessonSession) return (
  //   <div>{classroomLessonSession.current_slide}</div>
  // )
  // return (<div>Loading</div>)
// })

const Session: React.SFC<InputProps> = props => {
  const id = getParameterByName('classroom_unit_id') + props.params.lessonID;
  return (
    <Subscription<Response, Variables> subscription={QUERY} variables={{id}}>
      {
        ({ data, loading, error }) => {
          console.log(data, loading, error)
          if (loading) return <div>Loading</div>;
          if (error) return <h1>Subscription ERROR</h1>;
        
          if (data.classroomLessonSession) return (
            <div>Data loaded</div>
          )
          return (<div>Loading</div>)
        }
      }
    </Subscription>
  )

}

export default Session;