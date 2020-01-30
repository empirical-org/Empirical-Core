import React from 'react'

export default class TurkLanding extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showIntro: false,
    }
  }

  handleBeginClick = () => {
    const { lesson, begin, } = this.props

    if (lesson.landingPageHtml) {
      this.setState({showIntro: true})
    } else {
      begin()
    }
  }

  handleStartLessonClick = () => {
    const { begin, } = this.props
    begin()
  }

  render() {
    const { showIntro, } = this.state
    const { lesson, } = this.props
    if (showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{__html: lesson.landingPageHtml}} />
          <button className="quill-button focus-on-light large primary contained" onClick={this.handleStartLessonClick} type="button">Start lesson</button>
        </div>
      )
    } else {
      return (
        <div className="landing-page">
          <h1>You&#39;re testing new Quill Activities </h1>
          <p>
            You&#39;re about to answer questions about writing sentences.
            Please answer to the best of your ability.
          </p>
          <button className="quill-button focus-on-light primary contained large" onClick={this.handleBeginClick} type="button">Begin</button>
        </div>
      )
    }
  }

}
