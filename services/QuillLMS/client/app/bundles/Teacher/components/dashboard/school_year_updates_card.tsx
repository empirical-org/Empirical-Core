import * as React from 'react'

import { PostNavigationBanner } from '../../../Shared'

const closeIconSrc = `${process.env.CDN_URL}/images/pages/dashboard/bulk_archive_close_icon_orange.svg`

const SchoolYearUpdatesCard = ({ handleCloseCard, }) => {
  return (
    <PostNavigationBanner
      bannerStyle="gold-secondary school-year-updates-card"
      bodyText={
        <ul>
          <li>Content improvements for all Diagnostics</li>
          <li>Quill Reading for Evidence now provides green, yellow, and red scores for students and teachers</li>
          <li>New High School Reading for Evidence Offerings: Social Studies (World History) and Interdisciplinary Science (Building AI Knowledge)</li>
          <li>All ELL practice activities now provide bilingual translation to Spanish</li>
        </ul>
      }
      buttons={[
        {
          href: '/teacher-center/quills-four-big-updates-for-the-20242025-school-year#diagnostics',
          standardButtonStyle: true,
          text: "Learn more about Quill’s latest updates",
          target: "_blank"
        }
      ]}
      closeAria="Hide card until next school year"
      closeIconSrc={closeIconSrc}
      handleCloseCard={handleCloseCard}
      icon={{ alt: "Image of a school building", src: "https://assets.quill.org/images/banners/large-school-campus-gold.svg" }}
      primaryHeaderText="Four Big Updates for the 2024-2025 School Year"
    />
  )
}

export default SchoolYearUpdatesCard
