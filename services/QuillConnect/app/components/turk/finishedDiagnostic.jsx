import React from 'react'
export default class extends React.Component {
  componentDidMount() {
    this.props.saveToLMS()
  }

  render() {
    return (
      <div className="landing-page">
        <h1>You've completed the Quill Placement Activity </h1>
        <p>
          Your unique code is ij3982rmf9.
        </p>
      </div>
    )
  }
}
