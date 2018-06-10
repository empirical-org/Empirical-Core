import * as React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Article from './article'
import Questions from './questions'
export interface AppProps { 
  activity_id: string
}

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
    }
  }
`
}

export default class AppComponent extends React.Component<AppProps, any> {
  render() {
    return (
      <Query
        query={activityQuery(this.props.activity_id)}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;
          return (
            <div className="container">
              <div className="article-container">
                <h1 className="article-title">Read The Following Passage Carefully</h1>
                <Article activity_id={parseInt(this.props.activity_id)} article={data.activity.article} title={data.activity.title} />
                <h1 className="article-title">Now Complete The Following Sentences</h1>
                <Questions questions={data.activity.questions}/>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}
