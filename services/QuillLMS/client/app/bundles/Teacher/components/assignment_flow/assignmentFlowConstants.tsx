import * as React from 'react'

export const COLLEGE_BOARD_SLUG = 'college-board'
export const PRE_AP_SLUG = 'pre-ap'
export const AP_SLUG = 'ap'
export const SPRING_BOARD_SLUG = 'springboard'

export const SOCIAL_STUDIES_SLUG = 'social-studies'
export const WORLD_HISTORY_1200_TO_PRESENT_SLUG = 'world-history-1200-to-present'

export const UNIT_TEMPLATE_NAME = 'unitTemplateName'
export const UNIT_TEMPLATE_ID = 'unitTemplateId'
export const UNIT_NAME = 'unitName'
export const ACTIVITY_IDS_ARRAY = 'activityIdsArray'
export const CLASSROOMS = 'classrooms'
export const UNIT_ID = 'unitId'
export const ASSIGNED_CLASSROOMS = 'assignedClassrooms'
export const CLICKED_ACTIVITY_PACK_ID = 'clickedActivityPackId'
export const CREATE_YOUR_OWN_ID = 'createYourOwn'

export const STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID = 636
export const STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 651
export const INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID = 638
export const INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 639
export const ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID = 641
export const ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 642
export const ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID = 643
export const ELL_STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 644
export const ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID = 645
export const ELL_INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 646
export const ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID = 647
export const ELL_ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID = 649
export const PRE_AP_WRITINGS_SKILLS_1_UNIT_TEMPLATE_ID = 194
export const PRE_AP_WRITINGS_SKILLS_2_UNIT_TEMPLATE_ID = 195
export const AP_WRITINGS_SKILLS_UNIT_TEMPLATE_ID = 193
export const SPRING_BOARD_SKILLS_UNIT_TEMPLATE_ID = 253

export const DISABLED_DIAGNOSTIC_RECOMMENDATIONS_IDS = [1663, 1668, 1678, 1161, 1568, 1590]

export const starterPreTest = {
  activityId: 2537,
  name: 'Starter Diagnostic (Baseline Pre)',
  unitTemplateId: STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Plural nouns, possessive nouns, capitalization, subject-verb agreement, pronouns, and commonly confused words',
  when: 'Your students are working on basic grammar concepts.'
}

export const starterPostTest = {
  activityId: 2538,
  name: 'Starter Diagnostic (Growth Post)',
  unitTemplateId: STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The Starter Growth Diagnostic has different questions but covers the same skills as the Starter Baseline Diagnostic.',
  when: "Your students have completed the Starter Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the Starter Baseline Diagnostic yet. Assign it to unlock the Starter Growth Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
}

export const intermediatePreTest = {
  activityId: 2539,
  name: 'Intermediate Diagnostic (Baseline Pre)',
  unitTemplateId: INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Compound subjects, compound objects, compound predicates, compound sentences, complex sentences, compound-complex sentences, and conjunctive adverbs',
  when: 'Your students have practiced the basics of grammar and are ready to develop their sentence construction skills.'
}

export const intermediatePostTest = {
  activityId: 2540,
  name: 'Intermediate Diagnostic (Growth Post)',
  unitTemplateId: INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The Intermediate Growth Diagnostic has different questions but covers the same skills as the Intermediate Baseline Diagnostic.',
  when: "Your students have completed the Intermediate Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the Intermediate Baseline Diagnostic yet. Assign it to unlock the Intermediate Growth Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
}

export const advancedPreTest = {
  activityId: 2541,
  name: 'Advanced Diagnostic (Baseline Pre)',
  unitTemplateId: ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Relative clauses, appositive phrases, participial phrases, parallel structure, and open sentence combining',
  when: 'Your students are experienced with Quill, understand sentence combining, and are ready to develop advanced multi-clause sentences.'
}

export const advancedPostTest = {
  activityId: 2542,
  name: 'Advanced Diagnostic (Growth Post)',
  unitTemplateId: ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The Advanced Growth Diagnostic has different questions but covers the same skills as the Advanced Baseline Diagnostic.',
  when: "Your students have completed the Advanced Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the Advanced Baseline Diagnostic yet. Assign it to unlock the Advanced Growth Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
}

export const ellStarterPreTest = {
  activityId: 2550,
  name: 'ELL Starter Diagnostic (Baseline Pre)',
  unitTemplateId: ELL_STARTER_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Articles, plurals, possessives, pronouns, adjectives, adverbs, negation, questions, and prepositions',
  when: 'Your students are newcomer or beginner English learners working on basic English grammar concepts.'
}

export const ellStarterPostTest = {
  activityId: 2551,
  name: 'ELL Starter Diagnostic (Growth Post)',
  unitTemplateId: ELL_STARTER_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The ELL Starter Growth Diagnostic has different questions but covers the same skills as the ELL Starter Baseline Diagnostic.',
  when: "Your students have completed the ELL Starter Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the ELL Starter Baseline Diagnostic yet. Assign it to unlock the ELL Starter Growth Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
}

export const ellIntermediatePreTest = {
  activityId: 2555,
  name: 'ELL Intermediate Diagnostic (Baseline Pre)',
  unitTemplateId: ELL_INTERMEDIATE_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Simple tenses, progressive tenses, perfect tenses, and modality',
  when: 'Your students are beginner, intermediate, or advanced English learners working on English tenses.'
}

export const ellIntermediatePostTest = {
  activityId: 2557,
  name: 'ELL Intermediate Diagnostic (Growth Post)',
  unitTemplateId: ELL_INTERMEDIATE_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The ELL Intermediate Growth Diagnostic has different questions but covers the same skills as the ELL Intermediate Baseline Diagnostic.',
  when: "Your students have completed the ELL Intermediate Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the ELL Intermediate Baseline Diagnostic yet. Assign it to unlock the ELL Intermediate Growth Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
}

export const ellAdvancedPreTest = {
  activityId: 2563,
  name: 'ELL Advanced Diagnostic (Baseline Pre)',
  unitTemplateId: ELL_ADVANCED_DIAGNOSTIC_UNIT_TEMPLATE_ID,
  what: 'Challenging articles, countable vs. uncountable nouns, challenging pronouns, commonly confused words, gerunds vs. infinitives, -ed vs -ing adjectives, embedded questions, and responding to questions',
  when: 'Your students are upper-intermediate or advanced English learners who understand the basics of English but need practice correcting errors based on transfer from their home language(s) to English.'
}

export const ellAdvancedPostTest = {
  activityId: 2564,
  name: 'ELL Advanced Diagnostic (Growth Post)',
  unitTemplateId: ELL_ADVANCED_DIAGNOSTIC_POST_UNIT_TEMPLATE_ID,
  what: 'The ELL Advanced Growth Diagnostic has different questions but covers the same skills as the ELL Advanced Baseline Diagnostic.',
  when: "Your students have completed the ELL Advanced Baseline Diagnostic, you've assigned the recommended practice, and now you're ready to measure their growth.",
  lockedText: "This is locked because you haven't assigned the ELL Advanced Baseline Diagnostic yet. Assign it to unlock the ELL Advanced Growth Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
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
  1664: "You can't assign the Starter Growth Diagnostic to this class until you've assigned them the Starter Baseline Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics.",
  1669: "You can't assign the Intermediate Growth Diagnostic to this class until you've assigned them the Intermediate Baseline Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics.",
  1680: "You can't assign the Advanced Growth Diagnostic to this class until you've assigned them the Advanced Baseline Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics.",
  1774: "You can't assign the ELL Starter Growth Diagnostic to this class until you've assigned them the ELL Starter Baseline Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics.",
  1814: "You can't assign the ELL Intermediate Growth Diagnostic to this class until you've assigned them the ELL Intermediate Baseline Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics.",
  1818: "You can't assign the ELL Advanced Growth Diagnostic to this class until you've assigned them the ELL Advanced Baseline Diagnostic. If you are a co-teacher, please ask the classroom's owner to assign the diagnostics."
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
export const WHOLE_CLASS_LESSONS = 'Whole Class Lessons'
export const LANGUAGE_SKILLS = 'Language Skills'
export const READING_FOR_EVIDENCE = 'Reading for Evidence'
export const DAILY_PROOFREADING = 'Daily Proofreading'
export const CONNECT = 'Connect'
export const DIAGNOSTIC = 'Diagnostic'
export const GRAMMAR = 'Grammar'
export const PROOFREADER = 'Proofreader'
export const LESSONS = 'Lessons'

export const ACTIVITY_PACK_TYPES = [
  {
    name: 'Reading Texts',
    id: 'reading-texts'
  },
  {
    name: 'Diagnostic',
    id: 'diagnostic'
  },
  {
    name: 'Language Skills',
    id: 'independent-practice',
    types: ['Language Skill Review', 'Language Skills for Writing Genres', 'Language Skills Themed Practice']
  },
  {
    name: 'Whole Class Lessons',
    id: 'whole-class'
  },
]

export const DISABLED_DIAGNOSTICS = [
  'Starter Baseline Diagnostic (Pre)',
  'Starter Growth Diagnostic (Post)',
  'Intermediate Baseline Diagnostic (Pre)',
  'Intermediate Growth Diagnostic (Post)',
  'Advanced Baseline Diagnostic (Pre)',
  'Advanced Growth Diagnostic (Post)',
  'ELL Starter Baseline Diagnostic (Pre)',
  'ELL Starter Growth Diagnostic (Post)',
  'ELL Intermediate Baseline Diagnostic (Pre)',
  'ELL Intermediate Growth Diagnostic (Post)',
  'ELL Advanced Baseline Diagnostic (Pre)',
  'ELL Advanced Growth Diagnostic (Post)'
]
