import React from 'react'
import { Modal } from 'quill-component-library/dist/componentLibrary'
import { connect } from 'react-redux'
import _ from 'underscore'
import rootRef from "../../libs/firebase"
const sessionsRef = rootRef.child('sessions')

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: 'center',
    borderBottom: '1px solid grey',
    margin: '10px 0',
    fontSize: 18
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  name: {

  },
  score: {

  },
  response: {
    margin: '5px 0'
  }

};

class Lesson extends React.Component {
  state = {
    sessions: [],
    modalSession: null
  };

  componentDidMount() {
    sessionsRef.orderByChild("lessonID").startAt(this.props.params.lessonID).endAt(this.props.params.lessonID).once('value').then((snapshot) => {
      this.setState({sessions: snapshot.val()})
    })
  }

  getPercentageScore = (answerArray) => {
    return _.reduce(answerArray, (memo, answer) => {
      const score = this.answeredCorrectly(answer) ? 1 : 0;
      return memo + score
    }, 0) + "/" + answerArray.length;
  };

  answeredCorrectly = (answer) => {
    const lastAttempt = _.last(answer.attempts)
    if (lastAttempt.found) {
      return lastAttempt.response.optimal || false
    } else {
      return false
    }

  };

  closeModal = () => {
    this.setState({modalSession: null})
  };

  showModal = (session) => {
    this.setState({modalSession: session})
  };

  renderModal = () => {
    if (this.state.modalSession) {
      return (
        <Modal close={this.closeModal}>
          <div className="box">
            <h4 className="title">{this.state.modalSession.name}</h4>
            <ul>
              {this.renderStudentResponses(this.state.modalSession)}
            </ul>
          </div>
        </Modal>
      )
    }
  };

  renderSessionList = () => {
    return _.map(this.state.sessions, (session) => {
      return (
        <li key={session.key} onClick={this.showModal.bind(null, session)} style={styles.container}>
          <div>{session.name}</div>
          <div>{this.getPercentageScore(session.questions)}</div>
        </li>
      )
    })
  };

  renderStudentAttempts = (attempts) => {
    return _.map(attempts, (attempt) => {
      return <div style={styles.response}>{attempt.submitted}</div>
    })
  };

  renderStudentResponses = (session) => {
    return _.map(session.questions, (question) => {
      return (
        <li style={styles.container}>
          <div>{this.props.concepts.data[question.conceptID].name}</div>
          <div style={styles.column}>{this.renderStudentAttempts(question.attempts)}</div>
        </li>
      )
    })
  };

  render() {
    return (
      <div>
        <ul>
          {this.renderSessionList()}
        </ul>
        {this.renderModal()}
      </div>
    )
  }
}

function select(state) {
  return {
    concepts: state.concepts,
    lessons: state.lessons,
    questions: state.questions,
    routing: state.routing
  }
}

export default connect(select)(Lesson)
