import * as React from 'react';

import { PostNavigationBanner } from '../../../../Shared';


const FreeTrialStatus = ({ status, originPage, upgradeToPremiumNow, lastSubscriptionWasTrial, data, }) => {

  const headerText = status === 'trial' ? `You have ${data} days left in your trial.` : `Your Premium ${lastSubscriptionWasTrial ? 'Trial' : 'Subscription'} Has Expired`

  const upgradeButton = () => {
    if (originPage === 'premium') {
      return {
        onClick: upgradeToPremiumNow,
        standardButtonStyle: true,
        text: "Upgrade to Premium Now",
        target: ""
      }
    } else {
      return {
        href: "/premium",
        standardButtonStyle: true,
        text: "Upgrade to Premium Now",
        target: ""
      }
    }
  }

  return (
    <PostNavigationBanner
      bannerStyle="gold"
      bodyText="Getting value out of Premium?"
      buttons={[
        upgradeButton(),
        {
          href: "/premium",
          standardButtonStyle: false,
          text: "Check out our pricing plans.",
          target: ""
        }
      ]}
      icon={{ alt: "an orange jewel representing quill premium", src: `${process.env.CDN_URL}/images/icons/premium.svg` }}
      primaryHeaderText={headerText}
      tagText=""
    />
  );
}

export default FreeTrialStatus
