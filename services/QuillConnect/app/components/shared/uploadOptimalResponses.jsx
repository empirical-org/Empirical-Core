import * as React from 'react'

let fileReader

export default class UploadOptimalResponses extends React.Component {
  constructor(props) {
    super(props)

    this.state = { responses: [], }
  }

  handleFile() {
    const content = fileReader.result;
    this.setState({ responses: content.slice(1), })
  }

  handleChangeFile(file) {
    fileReader = new FileReader();
    fileReader.onloadend = this.handleFile;
    fileReader.readAsText(file);
  }

  submitResponses() {
    this.props.submitOptimalResponses(this.state.responses)
  }

  render() {
    return <div className="box">
      <h6 className="control subtitle">Upload optimal responses</h6>
      <p>Upload an xlsx file with one sheet, with the prompt as the top line and the optimal responses to create on each line after that.</p>
      <label className="label">File</label>
      <p className="control">
        <input
          type="file"
          accept=".txt"
          onChange={e => this.handleChangeFile(e.target.files[0])}
        />
      </p>
      <button className="button is-primary" onClick={this.submitResponses}>Upload Optimal Responses</button>
    </div>
  }

}
