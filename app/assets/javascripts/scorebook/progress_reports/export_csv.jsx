"use strict";

EC.ExportCsv = React.createClass({
  propTypes: {
    exportType: React.PropTypes.string.isRequired,
    filters: React.PropTypes.object.isRequired
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
        csv_export: {
          export_type: this.props.exportType,
          filters: this.props.filters
        }
      },
      dataType: 'json',
      type: 'POST',
      success: function onSuccess(data) {}
    });
  },

  render: function() {
    return (
      <div className="export-csv"><a onClick={this.createExport}>Export Csv</a></div>
    );
  }
});