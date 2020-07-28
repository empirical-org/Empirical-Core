import React from 'react'
const beginArrow = 'https://assets.quill.org/images/icons/begin_arrow.svg'

export default class TurkLanding extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showIntro: false,
    }
  }

  handleBeginClick = () => {
    const { landingPageHtml, begin, } = this.props
    if (landingPageHtml) {
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
    const { landingPageHtml, } = this.props
    if (showIntro) {
      return (
        <div className="container">
          <div className="landing-page-html" dangerouslySetInnerHTML={{__html: landingPageHtml}} />
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
          <button className="quill-button focus-on-light large primary contained" onClick={this.handleBeginClick} type="button">
            Begin
          </button>
        </div>
      )
    }
  }

}
