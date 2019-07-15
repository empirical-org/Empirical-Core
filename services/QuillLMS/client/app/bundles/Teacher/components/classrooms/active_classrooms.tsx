import * as React from 'react'

const emptyClassSrc = `${process.env.CDN_URL}/images/Illustrations/empty-class.svg`

export default class ActiveClassrooms extends React.Component<any, any> {

  renderPageContent() {
    if (this.props.classrooms.length === 0) {
      return <div className="no-active-classes">
        <img src={emptyClassSrc} />
        <p>Every teacher needs a class! Please select one of the buttons on the right to get started.</p>
      </div>
    }
  }

  render() {
    return <div className="active-classrooms classrooms-page">
      <div className="header">
        <h1>Active Classes</h1>
        <div className="buttons">
          <button className="quill-button medium secondary outlined import-from-google-button">Import from Google Classroom</button>
          <button className="quill-button medium primary contained create-a-class-button">Create a class</button>
        </div>
      </div>
      {this.renderPageContent()}
    </div>
  }
}
