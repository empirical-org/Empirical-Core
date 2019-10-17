import * as React from 'react'
import _ from 'lodash'
import XLSX from 'xlsx'

interface UploadOptimalResponsesProps {
  submitOptimalResponses: Function;
}

interface UploadOptimalResponsesState {
  responses: Array<string>
}

export class UploadOptimalResponses extends React.Component<UploadOptimalResponsesProps, UploadOptimalResponsesState> {
  constructor(props) {
    super(props)

    this.state = {
      responses: [],
    }

    this.handleChangeFile = this.handleChangeFile.bind(this)
    this.submitResponses = this.submitResponses.bind(this)
  }

  handleChangeFile(file: any) {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', });
      // get the first sheet of the excel workbook
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const responses = _.values(sheet).map((value: any) => value.v).filter(Boolean)
      // get every line after the first one, which should contain the prompt
      this.setState({ responses: responses.slice(1), })
    };
    fileReader.readAsArrayBuffer(file);
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
          accept=".xlsx"
          onChange={e => this.handleChangeFile(e.target.files[0])}
          type="file"
        />
      </p>
      <button className="button is-primary" onClick={this.submitResponses}>Upload Optimal Responses</button>
    </div>
  }

}
