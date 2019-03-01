import gql from "graphql-tag";

export default gql`
  mutation ChangeSlideNumber($id: String!, $slideNumber: String!) {
    setSessionCurrentSlide(
      id: $id,
      slideNumber: $slideNumber
    )
  }
`;