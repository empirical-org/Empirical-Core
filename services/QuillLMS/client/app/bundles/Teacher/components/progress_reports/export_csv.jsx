import React from 'react';

import Pusher from 'pusher-js';
import { requestPost, } from '../../../../modules/request/index';
import { ButtonLoadingSpinner, } from '../../../Shared/index'
;

export default class ExportCSV extends React.Component {
  static defaultProps = {requestUrl: `${process.env.DEFAULT_URL}/teachers/progress_reports/csv_exports`};

  constructor(props) {
    super(props)

    this.state = {csvUrl: undefined, waitingForCsv: false};
  }

  createExport = () => {
    if (this.props.disabled) {
      alert('CSV Exports are a Quill Premium Feature! Upgrade to Premium for reports, diagnostics, and more.')
    } else {
      const data = {
        report_url: this.props.reportUrl,
        csv_export: {
          export_type: this.props.exportType,
          filters: this.props.filters
        }
      }
      const that = this;

      requestPost(
        this.props.requestUrl,
        data,
        (body) => {
          that.initializePusher()
        },
        (body) => {
          alert('Something went wrong with your CSV export. Please contact support.')
        }
      )
    }
  };

  initializePusher = () => {
    this.setState({waitingForCsv: true})
    if (process.env.RAILS_ENV === 'development') {
      Pusher.logToConsole = true;
    }
    const pusher = new Pusher(process.env.PUSHER_KEY, { cluster: process.env.PUSHER_CLUSTER });
    let teacherId = this.props.teacher.id
    const channel = pusher.subscribe(teacherId.toString());
    const that = this;
    channel.bind('csv-export-completed', function(data) {
      that.csvReceived(data)
      pusher.unsubscribe(teacherId.toString())
    });
  };

  csvReceived = (data, teacherId) => {
    this.setState({waitingForCsv: false, csvUrl: data.message})
  };

  render() {
    let content
    const s = this.state
    if (s.csvUrl) {
      content = 'Ready: Click here'
    } else if (s.waitingForCsv) {
      content = (<span>
                        Downloading
        <ButtonLoadingSpinner />
      </span>)
    } else {
      content = 'Download Report'
    }
    return (
      <div className="export-csv">
        <a
          className="download-button q-button bg-quillgreen text-white"
          disabled={this.state.waitingForCsv}
          download={s.csvUrl ? 'CSV' : null}
          href={s.csvUrl || null}
          onClick={!s.csvUrl && !s.waitingForCsv ? this.createExport : null}
        >{content}</a>
      </div>
    );
  }
}
