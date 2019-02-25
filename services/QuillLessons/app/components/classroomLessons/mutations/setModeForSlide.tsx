import gql from "graphql-tag";

export const setModeForSlide:Function = gql`
  mutation setModeForSlide($id: String!, $slideNumber:  String!, $value: String) {
    setModeForSlide(id: $id, slideNumber: $slideNumber, value: $value) {
      deleted
      errors
      replaced
      inserted
      unchanged
    }
  }
`
