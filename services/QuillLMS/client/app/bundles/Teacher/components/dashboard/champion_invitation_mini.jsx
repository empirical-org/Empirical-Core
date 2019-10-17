import React from 'react';

class ChampionInvitationMini extends React.Component {
  render() {
    return (
      <div className="mini_container results-overview-mini-container col-md-4 col-sm-5 text-center">
        <div className="mini_content">
          <div className="gray-underline" style={{ padding: '8px', }}>
            <img className="mini-star-icon" src="https://assets.quill.org/images/icons/icon-star.svg" style={{ position: 'absolute', top: '-11px', right: '6px', transform: 'rotate(-22deg)', height: '27px', width: '27px', }} />
            <img className="mini-star-icon" src="https://assets.quill.org/images/icons/icon-star.svg" style={{ position: 'absolute', top: '-10px', right: '25px', transform: 'rotate(-4deg)', height: '14px', width: '14px', }} />
            <h3>Share Quill, Earn Free Premium!</h3>
          </div>
          <div>
            <img src="https://assets.quill.org/images/illustrations/champion.png" style={{ marginTop: 13, marginBottom: 11, height: 48, }} />
          </div>
          <p style={{ padding: '0px 15px', lineHeight: '1.57', fontFamily: 'lucida-grande, adelle-sans, helvetica', }}>
            With the new Quill Referral Program, you can earn rewards for helping fellow educators discover Quill.
          </p>
          <a href="/referrals" style={{ display: 'block', marginBottom: '12px', }}><button className="button button-white beta" style={{ maxWidth: '233px', width: '100%', margin: '15px auto 0px', }}>Earn Rewards</button></a>
          <a href="/referrals_toc" style={{ color: '#027360', }} target="_blank">Learn more about the Referral Program ></a>
        </div>
      </div>
    );
  }
}

export default ChampionInvitationMini;
