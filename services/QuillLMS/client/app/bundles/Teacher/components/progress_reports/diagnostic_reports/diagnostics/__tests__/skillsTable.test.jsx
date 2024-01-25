import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SkillsTable from '../skillsTable';

const skillGroupResults = [{"skill_group":"Adjectives and Adverbs","description":"Students who show proficiency in this skill correctly use single adjectives, adverbs, cumulative adjectives, coordinate adjectives, comparative adjectives, and superlative adjectives on a total of 7 questions.","skills":[{"id":18,"name":"Starter Pre Q7 - Comparative vs. Superlative Adjectives","number_correct":0,"number_incorrect":1,"question_uid":"-LKWu6ki2OHKFMAVZIko","proficiency_score":0,"summary":"Not correct"},{"id":19,"name":"Starter Pre Q14 - Adjectives and Adverbs","number_correct":0,"number_incorrect":1,"question_uid":"-LKWyxEPkvcrETG1dVN3","proficiency_score":0,"summary":"Not correct"},{"id":22,"name":"Starter Pre Q12 - Single Adjectives","number_correct":0,"number_incorrect":1,"question_uid":"-LKX3Kput_ae17nDodqp","proficiency_score":0,"summary":"Not correct"},{"id":40,"name":"Starter Pre Q6 - Comparative vs. Superlative Adjectives","number_correct":0,"number_incorrect":1,"question_uid":"-LL-z3Is5RTRvWyNZR6W","proficiency_score":0,"summary":"Not correct"},{"id":41,"name":"Starter Pre Q13 - Single Adverbs of Manner","number_correct":1,"number_incorrect":0,"question_uid":"-LL03FB3y06qdXC7cEI_","proficiency_score":1,"summary":"Fully correct"},{"id":286,"name":"Starter Pre Q18 - Cumulative Adjectives","number_correct":0,"number_incorrect":1,"question_uid":"d56040fb-8175-47c4-a522-7c07afa7629a","proficiency_score":0,"summary":"Not correct"},{"id":293,"name":"Starter Pre Q17 - Coordinate Adjectives","number_correct":0,"number_incorrect":1,"question_uid":"df237870-b7ff-420c-887a-827f26c04042","proficiency_score":0,"summary":"Not correct"}],"skill_ids":[18,19,22,40,41,286,293],"correct_skill_ids":[41],"number_of_correct_questions_text":"1 of 7 Questions Correct","proficiency_text":"Partial Proficiency","summary":"Partially correct","number_correct":1,"number_incorrect":6,"id":125,"question_uids":["-Lins3ua1sQQN6Tl7Q4h","-LinsDnhwR8T0jLx3Ypp","-LinspkyKBeYdTTIn8Zc","-LKWu6ki2OHKFMAVZIko","-LKWyxEPkvcrETG1dVN3","-LKX3Kput_ae17nDodqp","-LL-z3Is5RTRvWyNZR6W","-LL03FB3y06qdXC7cEI_","0f5f7a4f-62f6-48f6-a459-6b5580fc242f","411744f6-0a82-4570-8dec-06513342c838","87d6c318-8a55-4c68-8b61-c87561014491","bca7e621-0576-4547-b13e-668e449a8705","d56040fb-8175-47c4-a522-7c07afa7629a","df237870-b7ff-420c-887a-827f26c04042"]},{"skill_group":"Capitalization","description":"Students who show proficiency in this skill use capitalization at the beginning of a sentence and correct capitalization of names, dates, holidays, geographic locations, and the pronoun “I” on a total of 2 questions. ","skills":[{"id":198,"name":"Starter Pre Q11 - Capitalization (Basic)","number_correct":1,"number_incorrect":0,"question_uid":"7091424b-b0d2-4e0d-b283-d45840a2f1ce","proficiency_score":1,"summary":"Fully correct"},{"id":266,"name":"Starter Pre Q10 - Capitalization (Basic)","number_correct":1,"number_incorrect":0,"question_uid":"bb95f513-02b5-49e1-a1b3-48d9d1d2a9df","proficiency_score":1,"summary":"Fully correct"}],"skill_ids":[198,266],"correct_skill_ids":[198,266],"number_of_correct_questions_text":"2 of 2 Questions Correct","proficiency_text":"Full Proficiency","summary":"Fully correct","number_correct":2,"number_incorrect":0,"id":123,"question_uids":["235750e8-10e7-43a9-9b71-ed16c77f0a49","36e7e144-9783-4c85-9eb6-847fc52eb1b2","7091424b-b0d2-4e0d-b283-d45840a2f1ce","bb95f513-02b5-49e1-a1b3-48d9d1d2a9df"]},{"skill_group":"Commonly Confused Words","description":"Students who show proficiency in this skill will make the correct choice between the commonly confused words <i>your</i> and <i>you're</i>, and <i>their</i>, <i>they're</i>, and <i>there</i> on a total of 2 questions.","skills":[{"id":12,"name":"Starter Pre Q5 - Commonly Confused Words (Their/There/They're)","number_correct":0,"number_incorrect":1,"question_uid":"-LKc-s1Gzbf6QiyHHRr-","proficiency_score":0,"summary":"Not correct"},{"id":23,"name":"Starter Pre Q4 - Commonly Confused Words (Your/You're)","number_correct":1,"number_incorrect":0,"question_uid":"-LKXt53wwLoZW3EkmH_K","proficiency_score":1,"summary":"Fully correct"}],"skill_ids":[12,23],"correct_skill_ids":[23],"number_of_correct_questions_text":"1 of 2 Questions Correct","proficiency_text":"Partial Proficiency","summary":"Partially correct","number_correct":1,"number_incorrect":1,"id":128,"question_uids":["-LKc-s1Gzbf6QiyHHRr-","-LKXt53wwLoZW3EkmH_K","b64ed710-b18b-4079-84b2-0b72e7343f5e","dd6e3315-e738-4483-b7ad-ba2ed7b94e0e"]},{"skill_group":"Compound Subjects, Objects, and Predicates","description":"Students who show proficiency in this skill correctly form compound subjects and objects, agree the subject to the verb with a compound subject, and use correct punctuation when listing objects on a total of 3 questions.","skills":[{"id":61,"name":"Starter Pre Q20 - Compound Subjects","number_correct":0,"number_incorrect":1,"question_uid":"-LQtdcqlCN1k2GA_pGNF","proficiency_score":0,"summary":"Not correct"},{"id":134,"name":"Starter Pre Q21 - Listing Objects","number_correct":0,"number_incorrect":1,"question_uid":"285424c5-0d38-46e3-b48e-6d1adc3bbe26","proficiency_score":0,"summary":"Not correct"},{"id":310,"name":"Starter Pre Q19 - Compound Predicates","number_correct":0,"number_incorrect":1,"question_uid":"f28332d4-634d-45a6-ad3e-e18d08e290a2","proficiency_score":0,"summary":"Not correct"}],"skill_ids":[61,134,310],"correct_skill_ids":[],"number_of_correct_questions_text":"0 of 3 Questions Correct","proficiency_text":"No Proficiency","summary":"Not correct","number_correct":0,"number_incorrect":3,"id":127,"question_uids":["-LQtdcqlCN1k2GA_pGNF","285424c5-0d38-46e3-b48e-6d1adc3bbe26","31986bb0-534b-4519-98b8-ff6ac1b334ad","5ef3dca1-0ecd-4f39-bca0-dbc32725521d","e2a70630-210a-4888-a284-6e5f0d6d28e2","f28332d4-634d-45a6-ad3e-e18d08e290a2"]},{"skill_group":"Plural and Possessive Nouns","description":"Students who show proficiency in this skill will make the correct choice between a plural and possessive noun and use apostrophes correctly on a total of 2 questions.","skills":[{"id":14,"name":"Starter Pre Q9 - Plural vs. Possessive Nouns","number_correct":0,"number_incorrect":1,"question_uid":"-LKStUOiTFAuve_pUNNl","proficiency_score":0,"summary":"Not correct"},{"id":15,"name":"Starter Pre Q8 - Plural vs. Possessive Nouns","number_correct":1,"number_incorrect":0,"question_uid":"-LKSuWT89unu5gJ2WRip","proficiency_score":1,"summary":"Fully correct"}],"skill_ids":[14,15],"correct_skill_ids":[15],"number_of_correct_questions_text":"1 of 2 Questions Correct","proficiency_text":"Partial Proficiency","summary":"Partially correct","number_correct":1,"number_incorrect":1,"id":124,"question_uids":["-LinrO2cZGFlWXysOoVs","-LinrV9paU5zGnUuAN9t","-LKStUOiTFAuve_pUNNl","-LKSuWT89unu5gJ2WRip"]},{"skill_group":"Prepositional Phrases","description":"Students who show proficiency in this skill correctly place a prepositional phrase, agree the subject to the verb with a prepositional phrase, and correctly place adjectives, adverbs, and prepositional phrases together.","skills":[{"id":20,"name":"Starter Pre Q16 - Prepositional Phrases","number_correct":1,"number_incorrect":0,"question_uid":"-LKX1YDGP_nJ70U6_y-A","proficiency_score":1,"summary":"Fully correct"},{"id":42,"name":"Starter Pre Q15 - Prepositional Phrases","number_correct":1,"number_incorrect":0,"question_uid":"-LL5ho_8jppZoOmjaubo","proficiency_score":1,"summary":"Fully correct"}],"skill_ids":[20,42],"correct_skill_ids":[20,42],"number_of_correct_questions_text":"2 of 2 Questions Correct","proficiency_text":"Full Proficiency","summary":"Fully correct","number_correct":2,"number_incorrect":0,"id":126,"question_uids":["-LinsaouHGCBKj2eprfC","-Lint05rURFiNEg8K63T","-LKX1YDGP_nJ70U6_y-A","-LL5ho_8jppZoOmjaubo"]},{"skill_group":"Subject-Verb Agreement","description":"Students who show proficiency in this skill will correctly agree the subject to the verb.","skills":[{"id":16,"name":"Starter Pre Q1 - Basic Subject-Verb Agreement","number_correct":1,"number_incorrect":0,"question_uid":"-LKT0cJcWANIOLWdxGDA","proficiency_score":1,"summary":"Fully correct"},{"id":17,"name":"Starter Pre Q3 - Basic Subject-Verb Agreement","number_correct":1,"number_incorrect":0,"question_uid":"-LKWlY_fa3JXEFzQO3I8","proficiency_score":1,"summary":"Fully correct"},{"id":104,"name":"Starter Pre Q2 - Basic Subject-Verb Agreement","number_correct":1,"number_incorrect":0,"question_uid":"010d75a2-83e2-4329-95c0-0243a8a46151","proficiency_score":1,"summary":"Fully correct"}],"skill_ids":[16,17,104],"correct_skill_ids":[16,17,104],"number_of_correct_questions_text":"3 of 3 Questions Correct","proficiency_text":"Full Proficiency","summary":"Fully correct","number_correct":3,"number_incorrect":0,"id":216,"question_uids":["-LinooJU7h_BiASTmMFU","-Linp1yljwuUFNcXjiaQ","-LinpE9ODZ5__Km8E4px","-LKT0cJcWANIOLWdxGDA","-LKWlY_fa3JXEFzQO3I8","010d75a2-83e2-4329-95c0-0243a8a46151"]}]


describe('SkillsTable component', () => {
  test('should render when it is not expandable', () => {
    const { asFragment } = render(<SkillsTable
      isExpandable={false}
      skillGroupResults={skillGroupResults}
    />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('should render when it is expandable', () => {
    const { asFragment } = render(<SkillsTable
      isExpandable={true}
      skillGroupResults={skillGroupResults}
    />)
    expect(asFragment()).toMatchSnapshot();
  })

  test('should show every row when "Show more" is clicked', async () => {
    const rowCount = skillGroupResults.length;
    const defaultRowCount = 3; // Assuming this is the default row count that is initially displayed

    render(<SkillsTable isExpandable={true} skillGroupResults={skillGroupResults} />);

    // Check if only the default number of rows are displayed initially
    expect(screen.getAllByRole('row')).toHaveLength(defaultRowCount + 1); // +1 for the header row

    // Find and click the "Show more" button
    await userEvent.click(screen.getByText('Show more'));

    // Check if all rows are displayed after clicking the button
    expect(screen.getAllByRole('row')).toHaveLength(rowCount + 1); // +1 for the header row
  });

})
