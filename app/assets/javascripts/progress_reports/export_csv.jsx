"use strict";

EC.ExportCsv = React.createClass({
  propTypes: {
    exportType: React.PropTypes.string.isRequired,
    filters: React.PropTypes.object.isRequired,
    reportUrl: React.PropTypes.string.isRequired,
    teacher: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      requestUrl: '/teachers/progress_reports/csv_exports'
    };
  },

  createExport: function() {
    $.ajax({
      url: this.props.requestUrl,
      data: {
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
  },

  openModal: function() {
    $(this.refs.exportModal.getDOMNode()).modal();
  },

  render: function() {
    return (
      <div className="export-csv">
        <EC.ExportCsvModal email={this.props.teacher.email} ref="exportModal" />
        <button className="button-green" onClick={this.createExport}>Download Report</button>
      </div>
    );
  }
});