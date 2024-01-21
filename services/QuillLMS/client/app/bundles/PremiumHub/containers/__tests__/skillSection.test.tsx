import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import * as requestsApi from '../../../../modules/request';
import SkillSection from "../diagnosticGrowthReports/skillSection";

const props = {
  searchCount: 0,
  selectedGrades: [],
  selectedSchoolIds: [],
  selectedTeacherIds: [],
  selectedClassroomIds: [],
  selectedTimeframe: "This school year",
  pusherChannel: null,
  selectedDiagnosticId: null,
  passedData: null
}

const mockData = [
  {
    name: "Adjectives and Adverbs",
    preSkillScore: "39%",
    postSkillScore: "73%",
    growthResults: "+34%",
    studentsImprovedSkill: "32 of 47",
    studentsWithoutImprovement: "11 of 47",
    studentsMaintainedProficiency: "4 of 47",
    aggregate_rows: [
      {
        name: "Grade 4",
        preSkillScore: "27%",
        postSkillScore: "93%",
        growthResults: "+66%",
        studentsImprovedSkill: "0 of 3",
        studentsWithoutImprovement: "1 of 3",
        studentsMaintainedProficiency: "2 of 3"
      },
      {
        name: "Grade 5",
        preSkillScore: "29%",
        postSkillScore: "71%",
        growthResults: "+42%",
        studentsImprovedSkill: "31 of 41",
        studentsWithoutImprovement: "5 of 41",
        studentsMaintainedProficiency: "7 of 41"
      }
    ]
  },
  {
    name: "Capitalization",
    preSkillScore: "48%",
    postSkillScore: "66%",
    growthResults: "+18%",
    studentsImprovedSkill: "11 of 46",
    studentsWithoutImprovement: "22 of 46",
    studentsMaintainedProficiency: "14 of 46",
    aggregate_rows: [
      {
        name: "Grade 4",
        preSkillScore: "32%",
        postSkillScore: "25%",
        growthResults: "No Gain",
        studentsImprovedSkill: "5 of 21",
        studentsWithoutImprovement: "7 of 21",
        studentsMaintainedProficiency: "9 of 21"
      },
      {
        name: "Grade 5",
        preSkillScore: "40%",
        postSkillScore: "63%",
        growthResults: "+23%",
        studentsImprovedSkill: "10 of 35",
        studentsWithoutImprovement: "17 of 35",
        studentsMaintainedProficiency: "8 of 35"
      }
    ]
  }
]

describe('SkillSection', () => {
  beforeEach(() => {
    jest.spyOn(requestsApi, 'requestPost').mockImplementation((url, params, callback) => {
      callback([]);
    });
  })

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loading state', () => {
    test('it should render loading spinner', () => {
      const { asFragment } = render(<SkillSection {...props} />);

      expect(asFragment()).toMatchSnapshot();
      const loadingSpinner = screen.getByRole('img')

      expect(loadingSpinner.getAttribute('class')).toEqual('spinner')
    })
  })
  describe('loaded state', () => {
    test('it should render the expected header components', () => {
      props.passedData = []
      const { asFragment } = render(<SkillSection {...props} />);

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByRole('button', { name: /skill/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /pre skill score/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /post skill score/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /growth results/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /students improved skill/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /students without improvement/i })).toBeInTheDocument()

      expect(screen.getByRole('columnheader', { name: /students maintained proficiency/i })).toBeInTheDocument()

      expect(screen.getByText(/there is no diagnostic data available for the filters selected\. try modifying or removing a filter to see results\./i)).toBeInTheDocument()
    })
    test('it should render the expected data when data is present', () => {
      props.passedData = mockData
      const { asFragment } = render(<SkillSection {...props} />);

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByRole('cell', { name: /adjectives and adverbs/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /39%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /73%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /\+34%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /32 of 47/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /11 of 47/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /4 of 47/i })).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /grade 4/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /27%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /93%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /\+66%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /0 of 3/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /1 of 3/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /2 of 3/i })).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /grade 5/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /29%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /71%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /\+42%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /31 of 41/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /5 of 41/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /7 of 41/i })).toBeInTheDocument()
    })
    test('clicking toggle button should expand aggregate rows for skill', async () => {
      props.passedData = mockData
      const { asFragment } = render(<SkillSection {...props} />);
      const user = userEvent.setup()

      await user.click(screen.getByRole('button', { name: /show aggregate row data for capitalization/i }))

      expect(asFragment()).toMatchSnapshot();

      expect(screen.getByRole('cell', { name: /capitalization/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /48%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /66%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /\+18%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /11 of 46/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /22 of 46/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /14 of 46/i })).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /grade 4/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /32%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /25%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /no gain/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /5 of 21/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /7 of 21/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /9 of 21/i })).toBeInTheDocument()


      expect(screen.getByRole('cell', { name: /grade 5/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /40%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /63%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /\+23%/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /10 of 35/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /17 of 35/i })).toBeInTheDocument()

      expect(screen.getByRole('cell', { name: /8 of 35/i })).toBeInTheDocument()
    })
  })
})
