import gql from "graphql-tag";

export const selectStudentSubmission:Function = gql`
  mutation selectStudentSubmission($id: String!, $slideNumber:  String!, $studentId: String!) {
    selectStudentSubmission(id: $id, slideNumber: $slideNumber, studentId: $studentId) {
      deleted
      errors
      replaced
      inserted
      unchanged
    }
  }
`

export const deselectStudentSubmission:Function = gql`
  mutation deselectStudentSubmission($id: String!, $slideNumber:  String!, $studentId: String!) {
    deselectStudentSubmission(id: $id, slideNumber: $slideNumber, studentId: $studentId) {
      deleted
      errors
      replaced
      inserted
      unchanged
    }
  }
`

export const deselectAllStudentSubmissions:Function = gql`
  mutation deselectAllStudentSubmissions($id: String!, $slideNumber:  String!) {
    deselectAllStudentSubmissions(id: $id, slideNumber: $slideNumber) {
      deleted
      errors
      replaced
      inserted
      unchanged
    }
  }
`