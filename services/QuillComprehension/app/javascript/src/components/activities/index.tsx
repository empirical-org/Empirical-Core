import * as React from 'react';
import {connect} from 'react-redux'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Article from './article';
import Questions from './questions';
import QuestionSets from './question_sets';
import {markArticleAsRead, chooseQuestionSet} from '../../actions/activities';
import {ActivitiesState} from '../../reducers/activities';

export interface AppProps extends PassedProps, DispatchFromProps, StateFromProps { 
}

export interface PassedProps {
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

class ActivityContainer extends React.Component<AppProps, any> {
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
                <Article activity_id={parseInt(this.props.activity_id)} article={data.activity.article} title={data.activity.title} markAsRead={this.props.markArticleAsRead} />
                <QuestionSets questionSets={data.activity.question_sets} chooseQuestionSet={this.props.chooseQuestionSet} questionSetId={this.props.activities.questionSetId}/>
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

interface StateFromProps {
  activities: ActivitiesState;
}

interface DispatchFromProps {
  markArticleAsRead: () => void;
  chooseQuestionSet: (questionSetId:number) => void
}

const mapStateToProps = state => {
  return {
    activities: state.activities
  }
}

const mapDispatchToProps = dispatch => {
  return {
    markArticleAsRead: () => {
      dispatch(markArticleAsRead())
    },
    chooseQuestionSet: (questionSetId) => {
      dispatch(chooseQuestionSet(questionSetId))
    }
  }
}

export default connect<StateFromProps, DispatchFromProps, PassedProps>(mapStateToProps, mapDispatchToProps)(ActivityContainer)