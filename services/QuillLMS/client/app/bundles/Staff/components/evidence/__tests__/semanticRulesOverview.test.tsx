import { shallow } from 'enzyme';
import * as React from 'react';

import LabelsTable from '../semanticRules/labelsTable';
import ModelsTable from '../semanticRules/modelsTable';
import SemanticLabelsOverview from '../semanticRules/semanticLabelsOverview';

const mockProps = {
  activityId: '17',
  prompts: [{ id: 1 }, { id: 2 }, { id: 3 }]
};

describe('SemanticLabelsOverview component', () => {
  const container = shallow(<SemanticLabelsOverview {...mockProps} />);

  it('should render SemanticLabelsOverview', () => {
    expect(container).toMatchSnapshot();
  });

  it('should render a Labels Table and Models table for each prompt', () => {
    expect(container.find(LabelsTable).length).toEqual(3);
    expect(container.find(ModelsTable).length).toEqual(3);
  });
});
