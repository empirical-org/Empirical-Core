import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

export default class extends React.Component {

  premiumCreditsTable() {
    const creditRows = this.props.premiumCredits.map((credit) => {
      // if it is less than one week, we round up to 1
      const amountCredited = credit.amount > 6
        ? Math.round(credit.amount / 7)
        : 1;
      return (
        <tr key={`credit-${credit.id}-premium-credit-table`}>
          <td className="date-received">{moment(credit.created_at).format('MMMM Do, YYYY')}</td>
          <td className="amount-credited">{`${amountCredited} ${pluralize('week', amountCredited)}`}</td>
          <td className="action">{credit.action || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit!'}</td>
        </tr>
      );
    });
    return (
      <table className="premium-credits-table">
        <tbody>
          <tr>
            <th>Date Received</th>
            <th>Amount Credited</th>
            <th>Action</th>
          </tr>
          {creditRows}
        </tbody>
      </table>
    );
  }

  render() {
    const monthsOfCredit = Math.round(((this.props.earnedCredits / 30.42) * 10) / 10);
    return (
      <section>
        <div className="flex-row space-between">
          <h2>Earned Premium Credits History</h2>
          <a className="green-link" href="">How to earn more Premium credit</a>
        </div>
        {this.premiumCreditsTable()}
        <span className="total-premium-credits"><span className="total-header">Total Premium Credits Earned:</span> {`${monthsOfCredit} ${pluralize('month', monthsOfCredit)}`}</span>
      </section>
    );
  }

}
