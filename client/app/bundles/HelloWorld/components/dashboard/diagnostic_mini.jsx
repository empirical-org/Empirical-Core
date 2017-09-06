import React from 'react'
import _ from 'underscore'
import request from 'request';

export default class DiagnosticMini extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    this.getDiagnosticInfo();
  }

  getDiagnosticInfo() {
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/get_diagnostic_info_for_dashboard_mini`,
    },
    (e, r, response) => {
      debugger;
      that.setState(JSON.parse(response));
    });
  }


  render() {
    return(<div>{this.state.state}</div>)
  }
}
