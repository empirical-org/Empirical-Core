import * as React from 'react'

import { PostNavigationBanner } from '../../../Shared'

const closeIconSrc = `${process.env.CDN_URL}/images/pages/dashboard/bulk_archive_close_icon.svg`

const ScoringUpdatesCard = ({ handleCloseCard, }) => {
  return (
    <PostNavigationBanner
      bannerStyle="gold-secondary"
      bodyText=""
      buttons={[
        {
          href: `${process.env.DEFAULT_URL}/teacher-center/quill-scoring-updates-2023`,
          standardButtonStyle: true,
          text: "Learn more about Quill's updates to activity scores",
          target: "_blank"
        }
      ]}
      icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
      primaryHeaderText="Educators, we have updated our approach to scoring activities"
      secondaryHeaderText="Update for the 2023-2024 school year"
    />
  )
}

export default ScoringUpdatesCard
