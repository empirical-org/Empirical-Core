import { mount } from 'enzyme';
import * as React from 'react';
import { stripHtml } from "string-strip-html";
import { render, screen, }  from "@testing-library/react";
import userEvent from '@testing-library/user-event'

import AssignANewActivity from '../assign_a_new_activity';
import * as requestsApi from '../../../../../../modules/request';

jest.mock('string-strip-html', () => ({
  stripHtml: jest.fn(val => ({ result: val }))
}));

const passedSuggestedActivities = [
  {
    "id": 2370,
    "name": "Who Owns the Parthenon Sculptures? [Beta]",
    "description": "Students will read a text that explores the debate over whether the stolen Parthenon Sculptures should stay in Great Britain or be returned to Greece. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback.",
    "uid": "oDtvtmNzpZ8hU43L6x3uBA",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-10-24T20:06:17.049Z",
    "updated_at": "2023-06-09T19:44:12.390Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 13,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Social Studies",
        "World History",
        "European Countries & Cultures"
      ],
      [
        "Social Studies",
        "World History",
        "Ancient Civilizations"
      ],
      [
        "Society & The Arts",
        "Art & Artifacts",
        "Architecture & Artifacts"
      ]
    ],
    "publication_date": "10/24/2022"
  },
  {
    "id": 2369,
    "name": "Will Ancient Pompeii Survive for Another 2,000 Years? [Beta]",
    "description": "Students will read a text that explores the restoration of Ancient Pompeii. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback.",
    "uid": "ZIwXZ_KYaG2BK1PO7eVbfw",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-10-24T19:54:14.781Z",
    "updated_at": "2023-05-24T01:17:28.074Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 13,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Social Studies",
        "World History",
        "European Countries & Cultures"
      ],
      [
        "Social Studies",
        "World History",
        "Ancient Civilizations"
      ],
      [
        "Society & The Arts",
        "Art & Artifacts",
        "Architecture & Artifacts"
      ]
    ],
    "publication_date": "10/24/2022"
  },
  {
    "id": 2336,
    "name": "Should Public College Be Free? [Beta]",
    "description": "Students will read a text that explores opposing perspectives on free public college programs. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback. ",
    "uid": "dZ80skKiqmcjwyxK75fjNw",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-10-20T21:13:10.043Z",
    "updated_at": "2022-12-21T19:29:01.070Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 13,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "Daily Life",
        "School Policy"
      ]
    ],
    "publication_date": "10/20/2022"
  },
  {
    "id": 2329,
    "name": "Is Romeo and Juliet a Love Story or a Tragedy? ",
    "description": "Students will read a text that explores how Shakespeare's Romeo and Juliet challenges 16th-century understandings of tragedy and romance. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback.\\n",
    "uid": "aYy0vBLzPwLSxJT0HDCHaA",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-10-07T21:43:43.791Z",
    "updated_at": "2023-07-07T18:51:06.990Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 12,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "ELA",
        "Authors"
      ],
      [
        "Society & The Arts",
        "ELA",
        "Narratives"
      ]
    ],
    "publication_date": "10/07/2022"
  },
  {
    "id": 2327,
    "name": "Should College Applications Require Personal Essays? [Beta]",
    "description": "Students will read a text that explores opposing perspectives on the personal essay requirement in college applications. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback. ",
    "uid": "8kBWkQGHTW9aI_h-dCGA3w",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-09-14T20:29:36.567Z",
    "updated_at": "2023-03-24T18:56:16.851Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 13,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "Daily Life",
        "School Policy"
      ]
    ],
    "publication_date": "09/14/2022"
  },
  {
    "id": 2326,
    "name": "Why Is Simone Biles Called One of the Greatest Gymnasts of All Time? [Beta]",
    "description": "Students will read a text that explores the idea that Simone Biles is one of the greatest gymnasts of all time. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback.",
    "uid": "w7NhiRLR6Jhw5uRPJH6vlQ",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-08-29T17:18:46.577Z",
    "updated_at": "2023-01-27T17:14:04.919Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 13,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "Daily Life",
        "Sports & Recreation"
      ]
    ],
    "publication_date": "08/29/2022"
  },
  {
    "id": 2324,
    "name": "Should Esports Be Included in the Olympics? [Beta]",
    "description": "Students will read a text about whether esports should be included in the Olympics, exploring the perspectives of both advocates and critics of the initiative. Then, they'll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback.",
    "uid": "nA0acX7Kc84Bxdsiha_9Lg",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-08-24T21:43:31.024Z",
    "updated_at": "2023-06-26T20:12:24.350Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 12,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "Daily Life",
        "Sports & Recreation"
      ]
    ],
    "publication_date": "08/24/2022"
  },
  {
    "id": 2323,
    "name": "Should Hockey Players Be Required To Shake Hands After a Game? [Beta]",
    "description": "Students will read a text that explores opposing perspectives on the post-game hockey handshake requirement. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback. ",
    "uid": "GhQTxD_2JSDeaD0GvTnv4w",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-08-17T20:22:41.957Z",
    "updated_at": "2022-12-21T19:23:06.879Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 12,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "Daily Life",
        "Sports & Recreation"
      ]
    ],
    "publication_date": "08/17/2022"
  },
  {
    "id": 2322,
    "name": "Should Steroid Era Baseball Players Be Allowed in the Hall of Fame? [Beta]",
    "description": "Students will read about Major League Baseball and explore opposing viewpoints on allowing players from the Steroid Era to be inducted into the National Hall of Fame. Then, students will write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback.",
    "uid": "Q4-ELh3t1KFmn2fMzymfNw",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-08-16T22:23:29.912Z",
    "updated_at": "2023-02-24T23:45:55.562Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 13,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Society & The Arts",
        "Daily Life",
        "Sports & Recreation"
      ]
    ],
    "publication_date": "08/16/2022"
  },
  {
    "id": 2320,
    "name": "How are Drones Helping People Spot Sharks? [Beta]",
    "description": "Students will read a text that explores the use of shark-monitoring drones to increase public safety at beaches. Then, they’ll write three sentences using evidence from the text. Students will revise their work up to five times per sentence based on immediate feedback. ",
    "uid": "hGyG4UFr2ocq36zxnL4z8A",
    "data": null,
    "activity_classification_id": 9,
    "topic_id": null,
    "created_at": "2022-08-16T19:20:19.289Z",
    "updated_at": "2023-01-19T22:13:21.624Z",
    "flags": [
      "production"
    ],
    "repeatable": true,
    "follow_up_activity_id": null,
    "supporting_info": null,
    "standard_id": 114,
    "raw_score_id": 12,
    "minimum_grade_level": 8,
    "maximum_grade_level": 12,
    "topics": [
      [
        "Science",
        "Animals, Plants, & Humans",
        "Marine Animals"
      ],
      [
        "Society & The Arts",
        "Daily Life",
        "Internet & Technology"
      ]
    ],
    "publication_date": "08/16/2022"
  }
]

describe('AssignANewActivity component', () => {
  const requestGetSpy = jest.spyOn(requestsApi, 'requestGet').mockImplementation(() => ({ activities: passedSuggestedActivities, }))
  const requestPostSpy = jest.spyOn(requestsApi, 'requestPost').mockImplementation(() => { })

  describe('default', () => {
    const wrapper = mount(<AssignANewActivity />)
    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not render a diagnostic banner', () => {
      expect(wrapper.find('.diagnostic-banner').length).toBe(0)
    })
  })

  describe('when showDiagnosticBanner is true', () => {

    it('should render a diagnostic banner', () => {
      const wrapper = mount(<AssignANewActivity showDiagnosticBanner={true} />)
      expect(wrapper.find('.diagnostic-banner').length).toBe(1)

    });
  })

  describe('with suggested activities', () => {

    test('should render', () => {
      const { asFragment } = render(<AssignANewActivity passedSuggestedActivities={passedSuggestedActivities} />);
      expect(asFragment()).toMatchSnapshot();
    })

    test('should display six rows (including the header) to start in the data table', () => {
      render(<AssignANewActivity passedSuggestedActivities={passedSuggestedActivities} />)
      expect(screen.getAllByRole('row').length).toBe(6)
    })

    test('clicking the Show All button should render a row for every activity, plus the header, in the data table', async () => {
      render(<AssignANewActivity passedSuggestedActivities={passedSuggestedActivities} />)
      const user = userEvent.setup()
      await user.click(screen.getByRole('button', { name: /show all 10 reading for evidence activities/i }))

      expect(screen.getAllByRole('row').length).toBe(11)
    })

  })

});
