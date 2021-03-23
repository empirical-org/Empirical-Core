import * as React from 'react';
import { shallow } from 'enzyme';

import SemanticRulesOverview from '../semanticRules/semanticRulesOverview';
import LabelsTable from '../semanticRules/labelsTable';
import ModelsTable from '../semanticRules/modelsTable';

const mockProps = {
  activityId: '17',
  prompts: [{ id: 1 }, { id: 2 }, { id: 3 }]
};

describe('SemanticRulesOverview component', () => {
  const container = shallow(<SemanticRulesOverview {...mockProps} />);

  it('should render SemanticRulesOverview', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a Labels Table and Models table for each prompt', () => {
    expect(container.find(LabelsTable).length).toEqual(3);
    expect(container.find(ModelsTable).length).toEqual(3);
  });
});
