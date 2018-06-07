import * as React from 'react' 
import { Query } from "react-apollo";
import gql from "graphql-tag";

const Article = ({activity_id}): JSX.Element => (
  <Query
    query={gql`
      {
        activity(id: ${activity_id}) {
          title
          article
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      console.log(data)
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return (
        <div className="article-container">
          <h1 className="article-title">Read The Following Passage Carefully</h1>
          <div key={activity_id} className="article-card">
            <h2>{data.activity.title}</h2>
            <p dangerouslySetInnerHTML={{__html: data.activity.article}}></p>
          </div>
        </div>
      );
    }}
  </Query>
);

export default Article;