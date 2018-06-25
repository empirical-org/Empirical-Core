import * as React from 'react';
import {connect} from 'react-redux'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import * as R from 'ramda';

function activityQuery(activity_id:string) {
  return gql`
  {
    activity(id: ${activity_id}) {
      title
      article
      question_sets {
        id 
        prompt
        questions {
          id
          prompt
          order
        }
      }
      questions {
        id
        prompt
        order
      }
      vocabulary_words {
        id
        text
        description
        example
      }
    }
  }
`
}

class TagResponsesContainer extends React.Component<any> {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Query
        query={activityQuery(this.props.activity_id)}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div>
              <p>Hi</p>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default TagResponsesContainer