"use strict";

import React from 'react'
import ExportCsvModal from './export_csv_modal.jsx'
import $ from 'jquery'
export default React.createClass({
  propTypes: {
    exportType: React.PropTypes.string.isRequired,
    filters: React.PropTypes.object.isRequired,
    reportUrl: React.PropTypes.string.isRequired,
    teacher: React.PropTypes.object.isRequired,
    disabled: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      requestUrl: '/teachers/progress_reports/csv_exports'
    };
  },

  createExport: function() {
    if (this.props.disabled) {
      alert('CSV Exports are a Quill Premium Feature! Upgrade to Premium for reports, diagnostics, and more.')
    } else {
      $.ajax({
        url: this.props.requestUrl,
        data: {
          authenticity_token: $('meta[name=csrf-token]').attr('content'),
          report_url: this.props.reportUrl,
          csv_export: {
            export_type: this.props.exportType,
            filters: this.props.filters
          }
        },
        context: this,
        dataType: 'json',
        type: 'POST',
        success: function onSuccess(data) {
          this.openModal();
        },
        error: function(xhr) {
          alert('Something went wrong with your CSV export. Most likely it is not implemented yet.');
        }
      });
    }

  },

  openModal: function() {
    // TODO: fix modals using react-bootstrap so we can stop using js alerts
    // alert('Your Quill Progress Report is on its way! This table is being emailed to you as a CSV spreadsheet, which can be opened with Google Sheets or Excel. It should arrive within the next five minutes. Please Check: ' + {this.props.email} + ' If you do not receive an email within 10 minutes, please check your spamfolder.')
    alert('Your Progress Report is on its way!')
    // console.log($(this.refs.exportModal.getDOMNode()));
    // $(this.refs.exportModal.getDOMNode()).modal();
  },

  render: function() {
    return (
      <div className="export-csv">
        <ExportCsvModal email={this.props.teacher.email} ref="exportModal" />
        <button className="button-green" onClick={this.createExport}>Download Report</button>
      </div>
    );
  }
});
