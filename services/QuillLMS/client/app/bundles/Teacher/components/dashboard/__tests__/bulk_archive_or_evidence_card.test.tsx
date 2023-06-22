import { mount } from 'enzyme';
import 'isomorphic-fetch';
import * as React from 'react';

import BulkArchiveOrEvidenceCard from '../bulk_archive_or_evidence_card';
import BulkArchiveClassesCard from '../bulk_archive_classrooms_card'

const classrooms = [
  {
    name: "Quill Classroom Extremely Long So Long SUper Duper",
    id: "484134",
    code: "demo-6553451",
    student_count: "5",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-08-17 14:26:06.140275",
    grade: "9",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "A New Class",
    id: "484135",
    code: "van-guitar",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-04-26 15:26:05.306719",
    grade: "6",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "2",
    id: "484137",
    code: "writer-menu",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-08-26 19:16:43.07067",
    grade: "Other",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "4",
    id: "484139",
    code: "cheese-ideal",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-08-26 19:16:54.839985",
    grade: "Other",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "13",
    id: "484148",
    code: "poetry-stitch",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-08-26 19:45:54.813954",
    grade: "5",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  },
  {
    name: "15",
    id: "484150",
    code: "dogs-fruit",
    student_count: "0",
    google_classroom_id: null,
    clever_id: null,
    created_at: "2022-08-26 19:46:05.060615",
    grade: "5",
    activity_count: 0,
    has_coteacher: false,
    teacher_role: "owner"
  }
]

const sharedProps = {
  classrooms,
  userId: 1,
  handleBulkArchiveSuccess: jest.fn(),
  showEvidencePromotionCard: true
}

describe('BulkArchiveOrEvidenceCard container', () => {

  describe('BulkArchiveClassesCard rendering behavior', () => {

    beforeEach(() => {
      window.localStorage.clear();
    });

    describe('when it is May or earlier in the calendar year', () => {
      it('should not render the card when it has already been closed for the previous calendar year', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() =>
          new Date('2023-04-08T11:01:58.135Z').valueOf()
        );

        window.localStorage.setItem('2022BulkArchiveBannerClosedForUser1', 'true')

        const wrapper = mount(
          <BulkArchiveOrEvidenceCard
            passedCardClosedForRelevantYearInLocalStorage={true}
            {...sharedProps}
          />
        );

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find(BulkArchiveClassesCard)).toHaveLength(0);
      })

      it('should not render the card if no classes were created before July 1st of the previous calendar year', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() =>
          new Date('2022-03-08T11:01:58.135Z').valueOf()
        );

        const wrapper = mount(
          <BulkArchiveOrEvidenceCard
            passedCardClosedForRelevantYearInLocalStorage={false}
            {...sharedProps}
          />
        );

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find(BulkArchiveClassesCard)).toHaveLength(0);
      })

      it('should render the card if classes were created before July 1st of the previous calendar year and it has not been closed for the previous calendar year', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() =>
          new Date('2023-02-08T11:01:58.135Z').valueOf()
        );

        window.localStorage.setItem(`2021BulkArchiveBannerClosedForUser1`, 'true')

        const wrapper = mount(
          <BulkArchiveOrEvidenceCard
            passedCardClosedForRelevantYearInLocalStorage={false}
            {...sharedProps}
          />
        );

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find(BulkArchiveClassesCard)).toHaveLength(1);
      })
    })

    describe('when it is June or later in the calendar year', () => {
      it('should not render the card when it has already been closed for the current calendar year', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() =>
          new Date('2023-06-08T11:01:58.135Z').valueOf()
        );

        window.localStorage.setItem(`2023BulkArchiveBannerClosedForUser1`, 'true')

        const wrapper = mount(
          <BulkArchiveOrEvidenceCard
            passedCardClosedForRelevantYearInLocalStorage={true}
            {...sharedProps}
          />
        );

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find(BulkArchiveClassesCard)).toHaveLength(0);
      })

      it('should not render the card if no classes were created before July 1st of the current calendar year', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() =>
          new Date('2021-09-08T11:01:58.135Z').valueOf()
        );

        const wrapper = mount(
          <BulkArchiveOrEvidenceCard
            passedCardClosedForRelevantYearInLocalStorage={false}
            {...sharedProps}
          />
        );

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find(BulkArchiveClassesCard)).toHaveLength(0);
      })

      it('should render the card if classes were created before July 1st of the current calendar year and it has not been closed for the current calendar year', () => {
        jest.spyOn(global.Date, 'now').mockImplementation(() =>
          new Date('2023-05-08T11:01:58.135Z').valueOf()
        );

        const wrapper = mount(
          <BulkArchiveOrEvidenceCard
            passedCardClosedForRelevantYearInLocalStorage={false}
            {...sharedProps}
          />
        );

        expect(wrapper).toMatchSnapshot()
        expect(wrapper.find(BulkArchiveClassesCard)).toHaveLength(1);
      })
    })
  })
});
