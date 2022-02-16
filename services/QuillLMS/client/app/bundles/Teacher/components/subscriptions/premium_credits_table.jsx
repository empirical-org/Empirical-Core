import React from 'react';
import moment from 'moment';
import pluralize from 'pluralize';

const PremiumCreditsTable = ({ premiumCredits, earnedCredits, }) => {
  const renderPremiumCreditsTable = () => {
    const creditRows = premiumCredits.map((credit) => {
      // if it is less than one week, we round up to 1
      let amountCredited = credit.amount;
      if (amountCredited > 0) {
        amountCredited = credit.amount > 6
          ? Math.round(credit.amount / 7)
          : 1;
      } else {
        amountCredited = credit.amount < -6
          ? Math.round(credit.amount / 7)
          : -1;
      }
      return (
        <tr key={`credit-${credit.id}-premium-credit-table`}>
          <td className="date-received">{moment(credit.created_at).format('MMMM Do, YYYY')}</td>
          <td className="amount-credited">{`${amountCredited} ${pluralize('week', amountCredited)}`}</td>
          <td className="action">{credit.action}</td>
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

  const monthsOfCredit = Math.round(((earnedCredits / 30.42) * 10) / 10);
  return (
    <section>
      <div className="flex-row space-between">
        <h2>Earned Premium Credits History</h2>
        <a className="green-link" href="/referrals">How to earn more Premium credit</a>
      </div>
      {renderPremiumCreditsTable()}
      <span className="total-premium-credits"><span className="total-header">Total Premium Credits Earned:</span> {`${monthsOfCredit} ${pluralize('month', monthsOfCredit)}`}</span>
    </section>
  );
}

export default PremiumCreditsTable
