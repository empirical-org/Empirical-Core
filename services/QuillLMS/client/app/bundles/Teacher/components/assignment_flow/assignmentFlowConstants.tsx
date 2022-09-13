import * as React from 'react'

export const COLLEGE_BOARD_SLUG = 'college-board'
export const PRE_AP_SLUG = 'pre-ap'
export const AP_SLUG = 'ap'
export const SPRING_BOARD_SLUG = 'springboard'

export const UNIT_TEMPLATE_NAME = 'unitTemplateName'
export const UNIT_TEMPLATE_ID = 'unitTemplateId'
export const UNIT_NAME = 'unitName'
export const ACTIVITY_IDS_ARRAY = 'activityIdsArray'
export const CLASSROOMS = 'classrooms'
export const UNIT_ID = 'unitId'
export const ASSIGNED_CLASSROOMS = 'assignedClassrooms'
export const CLICKED_ACTIVITY_PACK_ID = 'clickedActivityPackId'

export const STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID = 99
export const STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 217
export const INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID = 100
export const INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 237
export const ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID = 126
export const ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 409
export const ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID = 154
export const ELL_STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 411
export const ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID = 299
export const ELL_INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 444
export const ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID = 300
export const ELL_ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 445
export const PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID = 194
export const PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID = 195
export const AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID = 193
export const SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID = 253

export const starterPreTest = {
  activityId: 1663,
  name: 'Starter Baseline Diagnostic (Pre)',
  unitTemplateId: STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Plural and possessive nouns, verbs, adjectives, adverbs of manner, commas, prepositions, basic capitalization, and commonly confused words',
  when: 'Your students are working on basic grammar concepts.'
}

export const starterPostTest = {
  activityId: 1664,
  name: 'Starter Growth Diagnostic (Post)',
  unitTemplateId: STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The Starter Growth Diagnostic has different questions but covers the same skills as the Starter Baseline Diagnostic.',
  when: "Your students have completed the Starter Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the Starter Baseline Diagnostic yet. Assign it to unlock the Starter Growth Diagnostic."
}

export const intermediatePreTest = {
  activityId: 1668,
  name: 'Intermediate Baseline Diagnostic (Pre)',
  unitTemplateId: INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Compound sentences, complex sentences, conjunctive adverbs, pronouns, and advanced capitalization',
  when: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.'
}

export const intermediatePostTest = {
  activityId: 1669,
  name: 'Intermediate Growth Diagnostic (Post)',
  unitTemplateId: INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The Intermediate Growth Diagnostic has different questions but covers the same skills as the Intermediate Baseline Diagnostic.',
  when: "Your students have completed the Intermediate Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the Intermediate Baseline Diagnostic yet. Assign it to unlock the Intermediate Growth Diagnostic."
}

export const advancedPreTest = {
  activityId: 1678,
  name: 'Advanced Baseline Diagnostic (Pre)',
  unitTemplateId: ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure',
  when: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop multi-clause sentences.'
}

export const advancedPostTest = {
  activityId: 1680,
  name: 'Advanced Growth Diagnostic (Post)',
  unitTemplateId: ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The Advanced Growth Diagnostic has different questions but covers the same skills as the Advanced Baseline Diagnostic.',
  when: "Your students have completed the Advanced Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the Advanced Baseline Diagnostic yet. Assign it to unlock the Advanced Growth Diagnostic."
}

export const ellStarterPreTest = {
  activityId: 1161,
  name: 'ELL Starter Baseline Diagnostic (Pre)',
  unitTemplateId: ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Simple verb conjugation, articles, subject-verb agreement, simple word order, singular and plural nouns, and adjective placement',
  when: 'Your students are beginning English language learners who are working on foundational grammar skills.'
}

export const ellStarterPostTest = {
  activityId: 1774,
  name: 'ELL Starter Growth Diagnostic (Post)',
  unitTemplateId: ELL_STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The ELL Starter Growth Diagnostic has different questions but covers the same skills as the ELL Starter Baseline Diagnostic.',
  when: "Your students have completed the ELL Starter Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the ELL Starter Baseline Diagnostic yet. Assign it to unlock the ELL Starter Growth Diagnostic."
}

export const ellIntermediatePreTest = {
  activityId: 1568,
  name: 'ELL Intermediate Baseline Diagnostic (Pre)',
  unitTemplateId: ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Subject-verb agreement, possessives, prepositions, future tense, articles, and intermediate questions',
  when: 'Your students are English language learners who have a foundational understanding of basic English grammar but need more practice with certain concepts.'
}

export const ellIntermediatePostTest = {
  activityId: 1814,
  name: 'ELL Intermediate Growth Diagnostic (Post)',
  unitTemplateId: ELL_INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The ELL Intermediate Growth Diagnostic has different questions but covers the same skills as the ELL Intermediate Baseline Diagnostic.',
  when: "Your students have completed the ELL Intermediate Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the ELL Intermediate Baseline Diagnostic yet. Assign it to unlock the ELL Intermediate Growth Diagnostic."
}

export const ellAdvancedPreTest = {
  activityId: 1590,
  name: 'ELL Advanced Baseline Diagnostic (Pre)',
  unitTemplateId: ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Regular and irregular past tense, progressive tenses, phrasal verbs, choosing between prepositions, responding to questions, and commonly confused words',
  when: 'Your students are English language learners who need practice with more difficult ELL skills before moving on to the Starter Diagnostic.'
}

export const ellAdvancedPostTest = {
  activityId: 1818,
  name: 'ELL Advanced Growth Diagnostic (Post)',
  unitTemplateId: ELL_ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The ELL Advanced Growth Diagnostic has different questions but covers the same skills as the ELL Advanced Baseline Diagnostic.',
  when: "Your students have completed the ELL Advanced Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the ELL Advanced Baseline Diagnostic yet. Assign it to unlock the ELL Advanced Growth Diagnostic."
}

export const apWritingSkills = {
  activityId: 992,
  name: 'AP Writing Skills Survey',
  unitTemplateId: AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID,
  what: 'Compound-complex sentences, appositive phrases, relative clauses, participial phrases, and parallel structure',
  when: 'Your students are developing their advanced sentence-level writing skills to prepare for writing in an AP® classroom.'
}

export const preAPWritingSkills1 = {
  activityId: 1229,
  name: 'Pre-AP Writing Skills Survey 1',
  unitTemplateId: PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID,
  what: 'Subject-verb agreement, pronouns, and coordinating and subordinating conjunctions',
  when: 'Your students are working on basic sentence patterns and the skills outlined in the Pre-AP® English High School Course Framework.'
}

export const preAPWritingSkills2 = {
  activityId: 1230,
  name: 'Pre-AP Writing Skills Survey 2',
  unitTemplateId: PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID,
  what: 'Conjunctive adverbs, relative clauses, appositive phrases, participial phrases, and parallel structure',
  when: 'Your students are working on basic sentence patterns and the skills outlined in the Pre-AP® English High School Course Framework.'
}

export const springboardWritingSkills = {
  activityId: 1432,
  name: 'SpringBoard Writing Skills Survey',
  unitTemplateId: SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID,
  what: 'Subject-verb agreement, pronouns, coordinating and subordinating conjunctions, prepositional phrases, and commonly confused words',
  when: 'Your students are working on basic sentence patterns and the grammar skills covered in the SpringBoard grades 6-8 materials.'
}


export const postTestClassAssignmentLockedMessages = {
  1664: "You can't assign the Starter Growth Diagnostic to this class until you've assigned them the Starter Baseline Diagnostic.",
  1669: "You can't assign the Intermediate Growth Diagnostic to this class until you've assigned them the Intermediate Baseline Diagnostic.",
  1680: "You can't assign the Advanced Growth Diagnostic to this class until you've assigned them the Advanced Baseline Diagnostic.",
  1774: "You can't assign the ELL Starter Growth Diagnostic to this class until you've assigned them the ELL Starter Baseline Diagnostic.",
  1814: "You can't assign the ELL Intermediate Growth Diagnostic to this class until you've assigned them the ELL Intermediate Baseline Diagnostic.",
  1818: "You can't assign the ELL Advanced Growth Diagnostic to this class until you've assigned them the ELL Advanced Baseline Diagnostic."
}

export const postTestWarningModalPreNameCorrespondence = {
  1664: "Starter Baseline Diagnostic (Pre)",
  1669: "Intermediate Baseline Diagnostic (Pre)",
  1680: "Advanced Baseline Diagnostic (Pre)",
  1774: "ELL Starter Baseline Diagnostic (Pre)",
  1814: "ELL Intermediate Baseline Diagnostic (Pre)",
  1818: "ELL Advanced Baseline Diagnostic (Pre)"
}

const connectSrc = `${process.env.CDN_URL}/images/icons/description-connect.svg`
const diagnosticSrc = `${process.env.CDN_URL}/images/icons/description-diagnostic.svg`
const lessonsSrc = `${process.env.CDN_URL}/images/icons/description-lessons.svg`
const proofreaderSrc = `${process.env.CDN_URL}/images/icons/description-proofreader.svg`
const grammarSrc = `${process.env.CDN_URL}/images/icons/description-grammar.svg`
const comprehensionSrc = `${process.env.CDN_URL}/images/icons/description-comprehension.svg`

export const imageTagForClassification = (classificationKey: string): JSX.Element => {
  let imgAlt = ""
  let imgSrc
  switch(classificationKey) {
    case 'connect':
      imgAlt = "Target representing Quill Connect"
      imgSrc = connectSrc
      break
    case 'diagnostic':
      imgAlt = "Magnifying glass representing Quill Diagnostic"
      imgSrc = diagnosticSrc
      break
    case 'sentence':
      imgAlt = "Puzzle piece representing Quill Grammar"
      imgSrc = grammarSrc
      break
    case 'lessons':
      imgAlt = "Apple representing Quill Lessons"
      imgSrc = lessonsSrc
      break
    case 'passage':
      imgAlt = "Flag representing Quill Proofreader"
      imgSrc = proofreaderSrc
      break
    case 'evidence':
      imgAlt = "Book representing Quill Reading for Evidence"
      imgSrc = comprehensionSrc
      break
  }

  return <img alt={imgAlt} src={imgSrc} />
}

export const READING_TEXTS = 'Reading Texts'

export const ACTIVITY_PACK_TYPES = [
  {
    name: 'Reading Texts',
    id: 'evidence'
  },
  {
    name: 'Diagnostic',
    id: 'diagnostic'
  },
  {
    name: 'Language Skills',
    id: 'language-skills'
  },
  {
    name: 'All Packs',
    id: 'independent-practice'
  },
  {
    name: 'Whole Class Lessons',
    id: 'whole-class'
  },
]
