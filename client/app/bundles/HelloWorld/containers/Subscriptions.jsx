import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

export default class extends React.Component {

  subscriptionHistoryRows() {
    const rows = [];
    this.props.subscriptions.forEach((sub) => {
      const startD = moment(sub.start_date);
      const endD = moment(sub.expiration);
      const duration = endD.diff(startD, 'months') + 1;
      rows.push(<tr key={sub.id}>
        <td>{moment(sub.created_at).format('MMMM Do, YYYY')}</td>
        <td>{sub.account_type}</td>
        <td>{sub.account_type}</td>
        <td>{`${duration} ${pluralize('month', duration)}`}</td>
        <td>{`${startD.format('MM/DD/YY')}-${endD.format('MM/DD/YY')}`}</td>
      </tr>);
      if (sub.credited) {
        rows.push(<tr>
          <td colSpan="5">credited</td>
        </tr>);
      }
    });
    return rows;
  }

  subscriptionHistory() {
    return (
      <table>
        <tbody>
          <tr>
            <th>Purchase Date</th>
            <th>Subscription</th>
            <th>Payment</th>
            <th>Length</th>
            <th>Start / End Date</th>
          </tr>
          {this.subscriptionHistoryRows()}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div>
        {this.subscriptionHistory()}
      </div>
    );
  }
}
