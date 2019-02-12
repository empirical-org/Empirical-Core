import gql from "graphql-tag";

export default gql`
  mutation deleteStudentSubmissionForSlide($id: String!, $slideNumber:  String!, $studentId: String!) {
    deleteStudentSubmissionForSlide(id: $id, slideNumber: $slideNumber, studentId: $studentId) {
      deleted
      errors
      replaced
      inserted
      unchanged
    }
  }
`