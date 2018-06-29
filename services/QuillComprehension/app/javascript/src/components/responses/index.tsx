import * as React from 'react';
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

function responsesQuery(question_id:string) {
  return gql`
  {
    question(id: ${question_id}) {
      prompt
      responses {
        id
        submissions
        text
      }
    }
    responseLabels {
      id
      name
      description
    }
  }
`
}

const SUBMIT_RESPONSE_LABEL_TAG = gql`
  mutation submitResponseLabelTag($response_id: ID!, $response_label_id: ID!, $score: Int)  {
    createResponseLabelTag(response_id: $response_id, response_label_id: $response_label_id, score: $score) {
      response_label_id
      response_id
      score
    }
  }
`;

function selectRandomItem(array:Array<any>):any {
  return array[Math.floor(Math.random()*array.length)];
}

class TagResponsesContainer extends React.Component<any> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={responsesQuery(this.props.question_id)}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          const response = selectRandomItem(data.question.responses);
          const label = selectRandomItem(data.responseLabels);
          return (
            <div className="card">
              <div className="card-header">
              <p><span style={{textTransform: "uppercase"}}>{ label.name}</span> -- {label.description} </p>
              </div>
              <div className="card-body">
                <p>{ response.text}</p>
              </div>
              <Mutation mutation={SUBMIT_RESPONSE_LABEL_TAG}>
                {(submitResponseLabelTag, { data }) => (
                  <div className="card-footer" style={{display:  "flex", flexDirection:  "row", alignItems: "left", justifyContent: "space around"}}>
                    <button className="btn btn-success mr1" style={{flexGrow: 1}} onClick={(e) => {
                      e.preventDefault();
                      submitResponseLabelTag({variables: {response_id: response.id, response_label_id: label.id, score:1}})
                      setTimeout(() => {window.location.reload()}, 500)
                    }}>Yes</button>
                    <button className="btn btn-danger ml1" style={{flexGrow:  1}} onClick={(e) => {
                      e.preventDefault();
                      submitResponseLabelTag({variables: {response_id: response.id, response_label_id: label.id, score:-1}})
                      setTimeout(() => {window.location.reload()}, 500)
                    }}>No</button>
                  </div>
                )}
              </Mutation>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default TagResponsesContainer
