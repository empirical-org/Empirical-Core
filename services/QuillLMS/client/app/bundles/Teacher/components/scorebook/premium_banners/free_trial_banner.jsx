import React from 'react';
import { requestPost } from '../../../../../modules/request/index';
import NewSignUpBanner from './new_signup_banner.jsx';
import { PostNavigationBanner } from '../../../../Shared';


export default class FreeTrialBanner extends React.Component {
  constructor(props) {
    super(props)

    this.state = { trialStarted: false, };
  }

  beginTrial = () => {
    requestPost('/subscriptions', { subscription: { account_type: 'Teacher Trial', }, }, () => {
      this.setState({ trialStarted: true, })
    })
  }

  render() {
    const { trialStarted, } = this.state

    if (trialStarted) {
      return (<NewSignUpBanner status="trial" />);
    }
    return (
      <PostNavigationBanner
        bannerStyle="gold"
        bodyText="Unlock your Premium trial to save time grading and gain actionable insights."
        buttons={[
          {
            onClick: this.beginTrial,
            standardButtonStyle: true,
            text: "Try it free for 30 Days",
            target: ""
          },
          {
            href: "/premium",
            standardButtonStyle: false,
            text: "Learn more about Premium",
            target: ""
          }
        ]}
        icon={{ alt: "", src: "" }}
        primaryHeaderText="Try Premium for Free"
        tagText=""
      />
    );
  }
}
