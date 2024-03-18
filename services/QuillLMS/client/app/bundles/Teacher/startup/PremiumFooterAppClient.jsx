import React from 'react';

import { PostNavigationBanner } from '../../Shared';


const PremiumFooterAppClient = () => {
  return(
    <PostNavigationBanner
      bannerStyle="gold"
      bodyText="Premium subscriptions for schools and districts interested in priority technical support, additional reporting, and support from Quill's professional learning team--plus an option for individual teachers"
      buttons={[
        {
          href: "/premium",
          standardButtonStyle: true,
          text: "Explore Premium",
          target: ""
        }
      ]}
      icon={{ alt: "an orange jewel representing quill premium", src: `${process.env.CDN_URL}/images/icons/premium.svg` }}
      primaryHeaderText="Learn More About Quill Premium"
      tagText=""
    />
  );
};

export default PremiumFooterAppClient;
