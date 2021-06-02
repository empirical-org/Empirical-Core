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
