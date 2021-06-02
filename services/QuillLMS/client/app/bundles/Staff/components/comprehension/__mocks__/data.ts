import { BUT, BECAUSE, SO }  from '../../../../../constants/comprehension';

const FEEDBACK = 'At no point in your rambling, incoherent response were you even close to anything that could be considered a rational thought. I award you no points, and may God have mercy on your soul.';

export const mockActivity = {
  title: 'Could Capybaras Create Chaos?',
  name: 'Could Capybaras Create Chaos? [student testing]',
  scored_level: '7',
  target_level: 7,
  parent_activity_id: '17',
  passages: [{text: '...'}],
  prompt_attributes: [
    {
      id: 7,
      conjunction: BECAUSE,
      text: '1',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK
    },
    {
      id: 8,
      conjunction: BUT,
      text: '2',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK
    },
    {
      id: 9,
      conjunction: SO,
      text: '3',
      max_attempts: 5,
      max_attempts_feedback: FEEDBACK
    }
  ]
}

export const mockRule = {
  id: 1,
  rule_type: 'rules-based-1' ,
  name: 'remove all instances of "it contains methane"',
  universal: false,
  optimal: false,
  suborder: 0,
  state: 'active',
  concept_uid: 'a34qreadbgt6',
  prompt_ids: [1, 2],
  feedbacks: [
    {
      id: 7,
      rule_id: 1,
      text: 'Revise your work. Delete the phrase "it contains methane" because it repeats the first part of the sentence',
      description: null,
      order: 0,
      highlights: []
    }
  ],
  regex_rules: [
    { id: 1, rule_id: 1, regex_text: 'it contain(s)? methane gas', case_sensitive: false, sequence_type: 'incorrect' },
    { id: 2, rule_id: 1, regex_text: 'another reg(ex) line', case_sensitive: true, sequence_type: 'required' },
    { id: 3, rule_id: 1, regex_text: 'some m?ore reg(ex', case_sensitive: false, sequence_type: 'incorrect' }
  ]
}
