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
      const sheet_array = XLSX.utils.sheet_to_json(sheet, {header:1})
      const responses = []
      _.forEach(sheet_array, (row: Array<String>) => {
        let responseObject = {}
        let concepts = []
        _.forEach(row.slice(1), (cell) => {
          concepts.push(cell)
        })
        responseObject["text"] = row[0]
        responseObject["concepts"] = concepts
        responses.push(responseObject)
      });
      this.setState({ responses: responses, })
    };
    fileReader.readAsArrayBuffer(file);
  }

  submitResponses() {
    this.props.submitOptimalResponses(this.state.responses)
  }

  render() {
    return (<div className="box">
      <h6 className="control subtitle">Upload optimal responses</h6>
      <p>Upload an xlsx file with the prompt in the first row, followed by optimal responses with their associated concepts.</p>
      <a href="https://docs.google.com/spreadsheets/d/1C9t_Ue2N_YBltoxB7MhSgE4XOpfgGCg3JJZeyUg6lSA/edit#gid=0">See example</a>
      <label className="label">File</label>
      <p className="control">
        <input
          accept=".xlsx"
          onChange={e => this.handleChangeFile(e.target.files[0])}
          type="file"
        />
      </p>
      <button className="button is-primary" onClick={this.submitResponses}>Upload Optimal Responses</button>
    </div>)
  }

}
