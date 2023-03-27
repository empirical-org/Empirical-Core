import { shallow } from 'enzyme';
import * as React from 'react';

import { UnitTemplate } from '..';

const unitTemplate = {
  id: 86,
  name: "Adjectives Practice - Swap Pack",
  unit_template_category_id: 4,
  time: 70,
  grades: ["1", "2", "4", "3", "5"],
  author_id: 11,
  flag: "private",
  readability: "4th-7th",
  diagnostic_names: [],
  order_number: 46,
  activity_info: "### What will students be doing? \n<br>\n\n* Students combine two sentences by adding a given adjective. \n* Students rewrite a sentence and fill in the blank with the correct word. \n* Students rewrite a sentence and correct the underlined word. <br>\n\n### What skills will students be practicing?\n<br>\n\n* Students practice adding and adjective before the correct noun.\n* Students practice forming and using comparative and superlative adjectives.\n* Students practice choosing between comparative and superlative adjectives based on the sentence.<br>\n\n### What is the theme of the pack?\n<br>\n\n* This pack does not have a theme. Each activity explores a different topic as students practice writing sentences with correct adjective form and use. \n",
  created_at: "2015-05-19T23:26:26.028Z",
  updated_at: "2015-05-19T23:26:26.028Z",
  image_link: null
}

describe('UnitTemplate component', () => {
  it('should match snapshot', () => {
    const wrapper = shallow(
      <UnitTemplate
        returnToIndex={() => null}
        unitTemplate={unitTemplate}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
