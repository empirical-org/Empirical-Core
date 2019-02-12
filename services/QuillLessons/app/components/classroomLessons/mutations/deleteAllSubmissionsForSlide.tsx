import gql from "graphql-tag";

export default gql`
  mutation deleteAllSubmissionsForSlide($id: String!, $slideNumber:  String!) {
    deleteAllSubmissionsForSlide(id: $id, slideNumber: $slideNumber) {
      deleted
      errors
      replaced
      inserted
      unchanged
    }
  }
`;