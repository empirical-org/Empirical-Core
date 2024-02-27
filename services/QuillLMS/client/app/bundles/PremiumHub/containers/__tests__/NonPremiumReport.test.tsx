import * as React from "react";
import { render } from "@testing-library/react";

import NonPremiumReport from "../NonPremiumReport";

describe('NonPremiumReport', () => {
  test('it should render if all optional props are passed in', () => {
    const { asFragment } = render(
      <NonPremiumReport
        bezelPath="usage_snapshot_report_product_bezel2x.png"
        headerText="Usage Snapshot Report"
        items={[
          {
            imgSrc: 'student_accounts_orange.svg',
            title: 'In-Depth Insights',
            body: 'Unlock 25 key metrics, from active users to most assigned concepts and activities.'
          },
          {
            imgSrc: 'teacher_at_board_orange.svg',
            title: 'Data-Driven Success',
            body: 'Make data-driven decisions and drive educational excellence by harnessing the power of your data.'
          },
          {
            imgSrc: 'sheets_of_paper_orange.svg',
            title: 'Effortless Reporting',
            body: 'Filter by timeframe, school, grade, teacher, or classroom. Download or subscribe to receive by email.'
          }
        ]}
        showNewTag={true}
        subheaderText="Key insights to help you succeed. Included with Quill Premium."
        testimonial={{
          attribution: "Shannon Browne, Professional Learning Manager",
          quote: "&#34;The Usage Snapshot Report completely redefines the way administrators use Quill. It enables them to make faster, more informed decisions that directly benefit their students&#39; success. This report is a game-changer for any administrator seeking to enhance educational outcomes.&#34;",
          imgSrc: "overview/shannon_headshot.png"
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  })

  test('it should render if only required props are passed in', () => {
    const { asFragment } = render(
      <NonPremiumReport
        bezelPath="usage_snapshot_report_product_bezel2x.png"
        headerText="Usage Snapshot Report"
        subheaderText="Key insights to help you succeed. Included with Quill Premium."
      />
    );
    expect(asFragment()).toMatchSnapshot();
  })
})
