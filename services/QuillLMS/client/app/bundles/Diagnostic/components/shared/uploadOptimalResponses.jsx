import * as React from 'react';
import XLSX from 'xlsx';

export default class UploadOptimalResponses extends React.Component {
  constructor(props) {
    super(props)

    this.state = { responses: [], }
  }

  handleChangeFile = file => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', });
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const responses = Object.values(sheet).map(value => value.v).filter(Boolean)
      this.setState({ responses: responses.slice(1), })
    };
    fileReader.readAsArrayBuffer(file);
  };

  submitResponses = () => {
    this.props.submitOptimalResponses(this.state.responses)
  };

  render() {
    return (
      <div className="box">
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
    )
  }
}
