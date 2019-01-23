import React from 'react';
import gql from 'graphql-tag';
// import  GetLessonQuery  from '../queries/getLessonQuery';
import { ChildDataProps, graphql } from "react-apollo";
import { ClassroomLesson } from '../../../interfaces/classroomLessons';

const QUERY = gql`
  query GetLesson($id: String!) {
    classroomLesson(id: $id) {
      id
      lesson
      title
      unit
    }
  }
`

type Response = {
  classroomLesson: ClassroomLesson
}

type Variables = {
  id: string 
}

type InputProps = {
  params: any
}

type ChildProps = ChildDataProps<InputProps, Response, Variables>;

const withLesson = graphql<InputProps, Response, Variables, ChildProps>(QUERY, {
  options: ({params}) => ({
    variables: {
      id: params.lessonID
    }
  })
})

export default withLesson(({ data: {loading, classroomLesson, error}}) => {
  if (loading) return <div>Loading</div>;
  if (error) return <h1>ERROR</h1>;
  return (
    <div>Loaded</div>
  )
})