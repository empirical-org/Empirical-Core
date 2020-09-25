import * as React from 'react';
import {connect} from 'react-redux'
import { Query } from "react-apollo";
import gql from "graphql-tag";
import * as R from 'ramda';
import {
  Play,
  Pause
} from 'react-feather';

import Article from './article';
import Questions from './questions';
import VocabularyWords from './vocabulary_words';

import {markArticleAsRead, chooseQuestionSet, setFontSize} from '../../actions/activities';
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
      questionSets {
        id
        prompt
        questions {
          id
          prompt
          order
          instructions
        }
      }
      questions {
        id
        prompt
        order
        instructions
      }
      vocabularyWords {
        id
        text
        description
        example
      }
    }
  }
`
}
const voiceSynth = window.speechSynthesis;
let voices;
class ActivityContainer extends React.Component<AppProps, any> {
  constructor(props) {
    super(props)
    voices = voiceSynth.getVoices();
  }

  speak(e) {
    e.preventDefault();
    voiceSynth.cancel();
    const script = window.getSelection().toString();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.voice = voices[49] ? voices[49] : voices[0];
    voiceSynth.speak(utterance)
  }

  cancelSpeak(e) {
    e.preventDefault();
    voiceSynth.cancel();
  }

  renderQuestions(activity, questionSetId, read) {
    if (!read) return;
    const questions = activity.questionSets[0].questions;
    return (
      <div>
        <h1 className="article-title">Now Complete The Following Sentences</h1>
        <Questions key={questionSetId} questions={questions} />
      </div>
    )

  }

  renderSubnav() {
    return (
      <div className="subnav">
        <div className="container d-fl-r jc-sb">
          <div className="subnav-left">
            <div className="subnav-item">Read</div>
            <div className="subnav-item">Choose</div>
            <div className="subnav-item">Answer</div>
            <div className="subnav-item">Review</div>
          </div>
          <div className="subnav-right">
            <div className="subnav-item"><button className="btn-icon" onClick={this.speak}><Play /></button></div>
            <div className="subnav-item" ><button className="btn-icon" onClick={this.cancelSpeak}><Pause /></button></div>
            <div className="subnav-item"><span className="d-fl-r ai-bl"><span className="fs-sm pa1" onClick={(e) => this.props.setFontSize(1)}>A</span> <span className="fs-md pa1" onClick={(e) => this.props.setFontSize(2)}>A</span> <span className="fs-lg pa1" onClick={(e) =>this.props.setFontSize(3)}>A</span></span></div>
          </div>
        </div>
      </div>
    )
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
              {this.renderSubnav()}
              <div className="container">
                <div className="article-container">
                  <VocabularyWords vocabWords={data.activity.vocabularyWords} />
                  <Article activity_id={parseInt(this.props.activity_id)} article={data.activity.article} fontSize={this.props.activities.fontSize} markAsRead={this.props.markArticleAsRead} title={data.activity.title} />
                  {this.renderQuestions(data.activity, this.props.activities.questionSetId, this.props.activities.readArticle)}
                </div>
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
  setFontSize: (fontSize:number) => void
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
    },
    setFontSize: (fontSize) => {
      dispatch(setFontSize(fontSize))
    }
  }
}

export default connect<StateFromProps, DispatchFromProps, PassedProps>(mapStateToProps, mapDispatchToProps)(ActivityContainer)
