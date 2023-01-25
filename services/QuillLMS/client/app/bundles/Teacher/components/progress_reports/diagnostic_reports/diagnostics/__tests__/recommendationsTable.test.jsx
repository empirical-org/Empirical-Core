import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme'
import * as $ from 'jquery'

import {
  independentRecommendationsNoStudentData,
  previouslyAssignedIndependentRecommendationsNoStudentData,
  lessonRecommendationsNoStudentData,
  independentRecommendationsWithStudentData,
  previouslyAssignedIndependentRecommendationsWithStudentData,
  previouslyAssignedLessonRecommendationsWithStudentData,
  lessonRecommendationsWithStudentData,
} from './test_data'

import RecommendationsTable from '../recommendationsTable'

const students = [{"id":11115764,"name":"Ja'shonda Abbott","completed":true},{"id":11115797,"name":"Paulo Azevedo","completed":true},{"id":11115765,"name":"Charlotte Bronte","completed":true},{"id":11115774,"name":"Edgar Burroughs","completed":true},{"id":11115787,"name":"Kaylesh Chaganlal","completed":true},{"id":11115791,"name":"Justin Cole","completed":true},{"id":11115784,"name":"Victoria De","completed":true},{"id":11115778,"name":"Gabriel De La Concordia Garcia","completed":false},{"id":11115783,"name":"Jacob De Haas","completed":false},{"id":11115786,"name":"Vishal Dewan","completed":true},{"id":11115767,"name":"Joan Didion","completed":false},{"id":11115769,"name":"John Donne","completed":true},{"id":11115796,"name":"Grace Hatton","completed":true},{"id":11115785,"name":"Judy Heier-hammond Name Keeps Going For A Long Long Tim","completed":false},{"id":11115795,"name":"Tymon Jabłoński","completed":false},{"id":11115782,"name":"Rudyard Kipling","completed":true},{"id":11115793,"name":"Leone Lafontaine","completed":false},{"id":11115794,"name":"Dehab Lee Kassis-washington","completed":false},{"id":11115777,"name":"Hilary Mantel","completed":false},{"id":11115776,"name":"Daphne Maurier","completed":false},{"id":11115792,"name":"Stephanie Montgomery","completed":false},{"id":11115790,"name":"George Nichols","completed":false},{"id":11115773,"name":"Joyce Oates","completed":false},{"id":11115766,"name":"Banjo Paterson","completed":false},{"id":11115771,"name":"Sarah Pennington","completed":false},{"id":11115770,"name":"Annie Proulx","completed":false},{"id":11115768,"name":"Sarah Scott","completed":false},{"id":11115780,"name":"Zadie Smith","completed":false},{"id":11115779,"name":"Rabindranath Tagore","completed":false},{"id":11115781,"name":"Henry Wadsworth Longfellow","completed":false},{"id":11115789,"name":"Virginia Walker","completed":false}]

const selectionsNoStudentData = [{"activity_count":4,"activity_pack_id":320,"name":"Compound-Complex Sentences","students":[]},{"activity_count":5,"activity_pack_id":322,"name":"Appositive Phrases","students":[]},{"activity_count":6,"activity_pack_id":324,"name":"Relative Clauses","students":[]},{"activity_count":5,"activity_pack_id":327,"name":"Participial Phrases","students":[]},{"activity_count":3,"activity_pack_id":329,"name":"Parallel Structure","students":[]},{"activity_count":5,"activity_pack_id":331,"name":"Advanced Combining","students":[]}]

const selectionsWithStudentData = [{"activity_count":7,"activity_pack_id":308,"diagnostic_progress":{},"name":"Capitalization","students":[11115784,11115786,11115796,11115769,11115787]},{"activity_count":5,"activity_pack_id":310,"diagnostic_progress":{},"name":"Plural and Possessive Nouns","students":[11115784,11115782,11115796,11115769,11115787,11115797]},{"activity_count":12,"activity_pack_id":312,"diagnostic_progress":{},"name":"Adjectives and Adverbs","students":[11115791,11115784,11115786,11115782,11115796,11115769,11115774,11115787,11115797,11115764]},{"activity_count":5,"activity_pack_id":314,"diagnostic_progress":{},"name":"Prepositional Phrases","students":[11115784,11115786,11115782,11115796,11115769,11115787,11115797,11115764]},{"activity_count":7,"activity_pack_id":316,"diagnostic_progress":{},"name":"Compound Subjects, Objects, and Predicates","students":[11115784,11115786,11115782,11115796,11115769,11115774,11115787,11115797]},{"activity_count":4,"activity_pack_id":318,"diagnostic_progress":{},"name":"Commonly Confused Words","students":[11115784,11115782,11115796,11115769,11115774,11115787,11115797]}]

const sharedProps = {
  responsesLink: jest.fn(),
  setSelections: jest.fn(),
  students: students,
  previouslyAssignedRecommendations: []
}

const hiddenPostTestProps = {
  postDiagnosticUnitTemplateId: 1,
  postTestSelections: [],
  studentsWhoCompletedAssignedRecommendations: [],
  studentsWhoCompletedDiagnostic: [],
  showPostTestAssignmentColumn: false,
  previouslyAssignedPostTestStudentIds: []
}

const shownPostTestProps = {
  ...hiddenPostTestProps,
  showPostTestAssignmentColumn: true,
  studentsWhoCompletedDiagnostic: students.filter(s => s.completed)
}

const noCompletedStudentsProps = {
  previouslyAssignedRecommendations: previouslyAssignedIndependentRecommendationsNoStudentData,
  recommendations: independentRecommendationsNoStudentData,
  selections: selectionsNoStudentData,
}

const recommendationsProps = {
  previouslyAssignedRecommendations: previouslyAssignedIndependentRecommendationsWithStudentData,
  recommendations: independentRecommendationsWithStudentData,
  selections: selectionsWithStudentData,
}

describe('RecommendationsTable component', () => {
  it('should render when no students have completed the diagnostic yet', () => {
    const wrapper = mount(<Router>
      <RecommendationsTable
        {...sharedProps}
        {...hiddenPostTestProps}
        {...noCompletedStudentsProps}
      />
    </Router>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there are recommendations', () => {
    const wrapper = mount(<Router>
      <RecommendationsTable
        {...sharedProps}
        {...hiddenPostTestProps}
        {...recommendationsProps}
      />
    </Router>)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render when there is data to assign a post test', () => {
    const wrapper = mount(<Router>
      <RecommendationsTable
        {...sharedProps}
        {...shownPostTestProps}
        {...recommendationsProps}
      />
    </Router>)
    expect(wrapper).toMatchSnapshot()
  })
})
