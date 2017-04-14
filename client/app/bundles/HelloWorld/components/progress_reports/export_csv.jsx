'use strict';

import React from 'react'
import ExportCsvModal from './export_csv_modal.jsx'
import $ from 'jquery'
import request from 'request'

export default React.createClass({
    propTypes: {
        exportType: React.PropTypes.string.isRequired,
        filters: React.PropTypes.object.isRequired,
        reportUrl: React.PropTypes.string.isRequired,
        teacher: React.PropTypes.object.isRequired,
        disabled: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {requestUrl: 'http://localhost:3000/teachers/progress_reports/csv_exports'};
    },

    createExport: function() {
        if (this.props.disabled) {
            alert('CSV Exports are a Quill Premium Feature! Upgrade to Premium for reports, diagnostics, and more.')
        } else {
            const data = {
                    authenticity_token: $('meta[name=csrf-token]').attr('content'),
                    report_url: this.props.reportUrl,
                    csv_export: {
                        export_type: this.props.exportType,
                        filters: this.props.filters
                    }
                }
                const that = this;
                request({
                    url: this.props.requestUrl,
                    method: 'POST',
                    json: data
                },
                (err, httpResponse, body) => {
                    if (httpResponse.statusCode === 200) {
                      that.openModal()
                    } else {
                        alert('Something went wrong with your CSV export. Please contact support.')
                    }
                })
            }
        },

        openModal: function() {
            // TODO: fix modals using react-bootstrap so we can stop using js alerts
            // alert('Your Quill Progress Report is on its way to your email! This table is being emailed to you as a CSV spreadsheet, which can be opened with Google Sheets or Excel. It should arrive within the next five minutes. Please Check: ' + {this.props.email} + ' If you do not receive an email within 10 minutes, please check your spamfolder.')
            alert('Your Progress Report is being emailed to you! It should arrive within the next five minutes.')
            // console.log($(this.refs.exportModal.getDOMNode()));
            // $(this.refs.exportModal.getDOMNode()).modal();
        },

        render: function() {
            return (
                <div className="export-csv">
                    <ExportCsvModal email={this.props.teacher.email} ref="exportModal"/>
                    <button className="button-green" onClick={this.createExport}>Download Report</button>
                </div>
            );
        }
    });
