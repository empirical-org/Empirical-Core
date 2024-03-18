import React from 'react';

import { PostNavigationBanner } from '../../../../Shared';


export default class NewSignUpBanner extends React.Component {
  stateSpecificComponents = () => {
    const { status } = this.props

    if (status === 'trial') {
      return <h4>Success! You started your 30 day trial</h4>
    } else {
      return <h4>Success! You now have Premium</h4>
    }
  };

  render() {
    const { stats } = this.props

    const headerText = stats === 'trial' ? "Success! You started your 30 day trial" : "Success! You now have Premium"
    return (
      <PostNavigationBanner
        bannerStyle="gold"
        bodyText="Now let’s save time grading and gain actionable insights."
        buttons={[
          {
            href: "/teachers/progress_reports/concepts/students",
            standardButtonStyle: true,
            text: "Check out Your Premium Student Results",
            target: ""
          }
        ]}
        icon={{ alt: "an orange jewel representing quill premium", src: `${process.env.CDN_URL}/images/icons/premium.svg` }}
        primaryHeaderText={headerText}
        tagText=""
      />
    );
  }
}
